(() => {
  "use strict";

  const {
    MOCK_DATA,
    MOCK_ACCOUNTS,
    DEFAULT_USER,
    readSession,
    isMockTransactionPasswordValid,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("DthRechargeController", [
    "$location",
    "$timeout",
    "$window",
    function ($location, $timeout, $window) {
      const vm = this;
      const mockUsers = (MOCK_DATA && MOCK_DATA.MOCK_USERS) || [];
      const session = readSession ? readSession() : null;
      const sessionUserId =
        session && session.user && session.user.userId ? session.user.userId : "";
      const fallbackUserId = DEFAULT_USER && DEFAULT_USER.userId ? DEFAULT_USER.userId : "";
      const activeUserId = sessionUserId || fallbackUserId;
      const activeUser =
        Array.isArray(mockUsers) && activeUserId
          ? mockUsers.find((user) => user.userId === activeUserId)
          : null;

      vm.title = "DTH Recharge";
      vm.subtitle = "Recharge your DTH connection quickly.";
      vm.step = "form";
      vm.error = "";
      vm.statusMessage = "";

      const allAccounts = Array.isArray(MOCK_ACCOUNTS) ? MOCK_ACCOUNTS : [];
      vm.accounts = allAccounts.filter((account) =>
        ["Savings", "Current", "Overdraft"].includes(account.type)
      );
      if (!vm.accounts.length) {
        vm.accounts = allAccounts;
      }
      const accountPlaceholder = {
        number: "",
        placeholderLabel: "From Accounts",
      };
      vm.accountOptions = vm.accounts.length ? [accountPlaceholder, ...vm.accounts] : [accountPlaceholder];

      vm.providers = [
        { label: "Service provider", value: "" },
        { label: "Tata Play", value: "Tata Play" },
        { label: "Airtel Digital TV", value: "Airtel Digital TV" },
        { label: "Dish TV", value: "Dish TV" },
        { label: "Sun Direct", value: "Sun Direct" },
      ];

      vm.form = {
        subscriberId: (activeUser && activeUser.dthSubscriberId) || "",
        provider: (activeUser && activeUser.dthProvider) || "",
        currency: "INR",
        amount: (activeUser && activeUser.dthAmount) || "",
        fromAccount: "",
        remarks: (activeUser && activeUser.dthRemarks) || "",
        transactionPassword: "",
      };
      vm.selectedAccount = null;

      vm.getAccountLabel = function (accountOrNumber) {
        if (!accountOrNumber) {
          return "From Accounts";
        }
        const account =
          typeof accountOrNumber === "string"
            ? vm.accounts.find((item) => item.number === accountOrNumber)
            : accountOrNumber;
        if (!account) {
          return "";
        }
        if (account.placeholderLabel) {
          return account.placeholderLabel;
        }
        const maskedNumber = (window.HPGB_APP && window.HPGB_APP.maskAccountNumber)
          ? window.HPGB_APP.maskAccountNumber(account.number)
          : account.number;

        return `${maskedNumber} (${account.currency}) - ${account.holder.toUpperCase()}`;
      };

      vm.onAccountChange = function () {
        vm.selectedAccount =
          vm.accounts.find((account) => account.number === vm.form.fromAccount) || null;
      };

      vm.submitForm = function () {
        vm.error = "";
        const subscriberId = String(vm.form.subscriberId || "").trim();
        if (!subscriberId) {
          vm.error = "Enter subscriber ID.";
          return;
        }
        if (!vm.form.provider) {
          vm.error = "Select service provider.";
          return;
        }
        if (!vm.form.amount) {
          vm.error = "Enter amount.";
          return;
        }
        const amount = Number(String(vm.form.amount).replace(/,/g, ""));
        if (!Number.isFinite(amount) || amount <= 0) {
          vm.error = "Enter a valid amount.";
          return;
        }
        if (!vm.form.fromAccount) {
          vm.error = "Select from account.";
          return;
        }
        vm.onAccountChange();
        if (!vm.selectedAccount || !vm.selectedAccount.balance) {
          vm.error = "Unable to read account balance.";
          return;
        }
        const rawBalance = String(vm.selectedAccount.balance).replace(/,/g, "");
        const balanceValue = Number(rawBalance);
        if (!Number.isFinite(balanceValue)) {
          vm.error = "Unable to read account balance.";
          return;
        }
        if (amount > balanceValue) {
          vm.error = "Recharge amount exceeds available balance.";
          return;
        }
        vm.form.subscriberId = subscriberId;
        vm.step = "authorize";
      };

      vm.authorize = function () {
        const password = (vm.form.transactionPassword || "").trim();
        if (!password) {
          vm.error = "TPIN is required.";
          return;
        }
        const isMatch = isMockTransactionPasswordValid
          ? isMockTransactionPasswordValid(password)
          : true;
        if (!isMatch) {
          vm.error = "TPIN is incorrect.";
          return;
        }
        vm.error = "";
        vm.statusMessage = "DTH recharge submitted successfully.";
        $timeout(() => {
          vm.step = "success";
        }, 200);
      };

      vm.newRequest = function () {
        vm.step = "form";
        vm.error = "";
        vm.statusMessage = "";
        vm.form.transactionPassword = "";
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
  ]);
})();
