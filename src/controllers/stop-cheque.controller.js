(() => {
  "use strict";

  const { MOCK_ACCOUNTS, isMockTransactionPasswordValid } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("StopChequeController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Stop Cheque";
      vm.subtitle = "Submit a stop payment request for a cheque.";

      const allAccounts = Array.isArray(MOCK_ACCOUNTS) ? MOCK_ACCOUNTS : [];
      vm.accounts = allAccounts.filter((account) =>
        ["Savings", "Current", "Overdraft"].includes(account.type)
      );
      if (!vm.accounts.length) {
        vm.accounts = allAccounts;
      }

      vm.reasons = [
        "Cheque book not received",
        "Others",
        "Wrong amount spelt",
        "Insufficient balance",
        "AMT IN FIG AND WORD DIFF",
      ];

      vm.step = "form";
      vm.formError = "";
      vm.statusMessage = "";
      vm.form = {
        account: null,
        chequeNumber: "",
        reason: null,
        transactionPassword: "",
      };

      vm.getAccountLabel = function (accountOrNumber) {
        if (!accountOrNumber) {
          return "";
        }
        const account =
          typeof accountOrNumber === "string"
            ? vm.accounts.find((item) => item.number === accountOrNumber)
            : accountOrNumber;
        if (!account) {
          return "";
        }
        const maskedNumber = (window.HPGB_APP && window.HPGB_APP.maskAccountNumber)
          ? window.HPGB_APP.maskAccountNumber(account.number)
          : account.number;

        return `${maskedNumber} (${account.currency}) - ${account.holder.toUpperCase()}`;
      };

      vm.continueToAuthorize = function () {
        vm.formError = "";
        if (!vm.form.account) {
          vm.formError = "Select an account number.";
          return;
        }
        if (!vm.form.chequeNumber) {
          vm.formError = "Enter cheque number.";
          return;
        }
        if (!vm.form.reason) {
          vm.formError = "Select reason.";
          return;
        }
        vm.step = "authorize";
      };

      vm.authorize = function () {
        const password = (vm.form.transactionPassword || "").trim();
        if (!password) {
          vm.statusMessage = "TPIN is required.";
          return;
        }
        const isMatch = isMockTransactionPasswordValid(password);
        if (!isMatch) {
          vm.statusMessage = "TPIN is incorrect.";
          return;
        }
        vm.statusMessage = "";
        vm.step = "success";
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
    ]);
})();
