(() => {
  "use strict";

  const {
    MOCK_DATA,
    MOCK_ACCOUNTS,
    DEFAULT_USER,
    readSession,
    isMockTransactionPasswordValid,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("BillPaymentController", [
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

      vm.title = "Bill Payment";
      vm.subtitle = "Pay utility bills quickly and securely.";
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

      vm.categories = [
        { label: "Biller Category", value: "" },
        { label: "Telecom", value: "Telecom" },
        { label: "Postpaid", value: "Postpaid" },
        { label: "Electricity", value: "Electricity" },
        { label: "Water", value: "Water" },
        { label: "Gas", value: "Gas" },
      ];
      const billersByCategory = {
        Telecom: ["Airtel", "Jio", "BSNL", "Vi"],
        Postpaid: ["BSNL Postpaid", "Airtel Postpaid", "Jio Postpaid", "Vi Postpaid"],
        Electricity: ["HPSEB", "DVVNL", "BSES"],
        Water: ["Jal Board", "City Water"],
        Gas: ["Indane", "HP Gas", "Bharat Gas"],
      };

      vm.billerOptions = [{ label: "Biller Name", value: "" }];

      vm.form = {
        category: (activeUser && activeUser.billCategory) || "",
        biller: (activeUser && activeUser.billerName) || "",
        amount: (activeUser && activeUser.billAmount) || "",
        mobile: (activeUser && activeUser.billMobile) || "",
        billNumber: (activeUser && activeUser.billNumber) || "",
        fromAccount: "",
        date: "",
        transactionPassword: "",
        currency: "INR",
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

      vm.onCategoryChange = function () {
        const billers = billersByCategory[vm.form.category] || [];
        vm.billerOptions = [{ label: "Biller Name", value: "" }].concat(
          billers.map((name) => ({ label: name, value: name }))
        );
        if (!billers.includes(vm.form.biller)) {
          vm.form.biller = "";
        }
      };

      vm.onCategoryChange();

      vm.submitForm = function () {
        vm.error = "";
        if (!vm.form.category) {
          vm.error = "Select biller category.";
          return;
        }
        if (!vm.form.biller) {
          vm.error = "Select biller name.";
          return;
        }
        if (!vm.form.amount) {
          vm.error = "Enter bill amount.";
          return;
        }
        const amount = Number(String(vm.form.amount).replace(/,/g, ""));
        if (!Number.isFinite(amount) || amount <= 0) {
          vm.error = "Enter a valid bill amount.";
          return;
        }
        const mobile = String(vm.form.mobile || "").replace(/\s+/g, "");
        if (!mobile) {
          vm.error = "Enter mobile number.";
          return;
        }
        if (!/^\d{10}$/.test(mobile)) {
          vm.error = "Enter a valid 10 digit mobile number.";
          return;
        }
        if (!vm.form.fromAccount) {
          vm.error = "Select from account.";
          return;
        }
        if (!vm.form.date) {
          vm.error = "Select date.";
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
          vm.error = "Bill amount exceeds available balance.";
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
        vm.statusMessage = "Bill payment submitted successfully.";
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
