(() => {
  "use strict";

  const {
    MOCK_DATA,
    MOCK_ACCOUNTS,
    DEFAULT_USER,
    readSession,
    isMockTransactionPasswordValid,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("MobileRechargeController", [
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

      vm.title = "Recharge Mobile";
      vm.subtitle = "Top up prepaid mobile connections instantly.";
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
      if (vm.accounts.length > 0) {
        vm.accountOptions = [accountPlaceholder, ...vm.accounts];
      } else {
        vm.accountOptions = [accountPlaceholder];
      }

      vm.providers = [
        { label: "Service provider", value: "" },
        { label: "Airtel", value: "Airtel" },
        { label: "Jio", value: "Jio" },
        { label: "BSNL", value: "BSNL" },
        { label: "Vi", value: "Vi" },
      ];
      vm.circles = [
        { label: "Circle", value: "" },
        { label: "All India", value: "All India" },
      ];

      vm.form = {
        mobile: (activeUser && activeUser.rechargeMobile) || "",
        provider: (activeUser && activeUser.rechargeProvider) || "",
        circle: (activeUser && activeUser.rechargeCircle) || "",
        currency: "INR",
        amount: (activeUser && activeUser.rechargeAmount) || "",
        fromAccount: "",
        remarks: (activeUser && activeUser.rechargeRemarks) || "",
        transactionPassword: "",
      };
      vm.selectedAccount = null;
      vm.showPlans = false;
      vm.planOptions = [
        { label: "Unlimited Talktime + 1.5GB/day (28 days)", amount: "239" },
        { label: "Unlimited Talktime + 1.5GB/day (56 days)", amount: "479" },
        { label: "Unlimited Talktime + 2GB/day (84 days)", amount: "719" },
        { label: "Unlimited Talktime + 3GB/day (90 days)", amount: "999" },
      ];

      vm.onAccountChange = function () {
        vm.selectedAccount =
          vm.accounts.find((account) => account.number === vm.form.fromAccount) || null;
      };

      vm.lastActiveElement = null;

      vm.openPlans = function () {
        vm.lastActiveElement = $window.document.activeElement;
        vm.showPlans = true;
        $timeout(() => {
          const firstPlan = $window.document.getElementById("recharge-plan-first");
          if (firstPlan && typeof firstPlan.focus === "function") {
            firstPlan.focus();
            return;
          }
          const modal = $window.document.querySelector(".modal-sheet.open");
          if (modal && typeof modal.focus === "function") {
            modal.focus();
          }
        }, 0);
      };

      vm.closePlans = function () {
        vm.showPlans = false;
        $timeout(() => {
          if (vm.lastActiveElement && typeof vm.lastActiveElement.focus === "function") {
            vm.lastActiveElement.focus();
          }
        }, 0);
      };

      vm.selectPlan = function (plan) {
        if (!plan) {
          return;
        }
        vm.form.amount = plan.amount;
        vm.closePlans();
      };

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

      vm.submitForm = function () {
        vm.error = "";
        const mobile = String(vm.form.mobile || "").replace(/\s+/g, "");
        if (!mobile) {
          vm.error = "Enter 10 digit mobile number.";
          return;
        }
        if (!/^\d{10}$/.test(mobile)) {
          vm.error = "Enter a valid 10 digit mobile number.";
          return;
        }
        if (!vm.form.provider) {
          vm.error = "Select service provider.";
          return;
        }
        if (!vm.form.circle) {
          vm.error = "Select circle.";
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
        vm.form.mobile = mobile;
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
        vm.statusMessage = "Mobile recharge submitted successfully.";
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
