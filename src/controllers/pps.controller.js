(() => {
  "use strict";

  const {
    MOCK_ACCOUNTS,
    MOCK_CHEQUE_STATUS,
    MOCK_CHEQUE_UNUSED_RANGE,
    isMockTransactionPasswordValid,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("PpsController", [
      "$location",
      "$timeout",
      function ($location, $timeout) {
      const vm = this;
      vm.title = "Positive Pay System";
      vm.subtitle = "Submit cheque details for verification.";

      const allAccounts = Array.isArray(MOCK_ACCOUNTS) ? MOCK_ACCOUNTS : [];
      vm.accounts = allAccounts.filter((account) =>
        ["Savings", "Current", "Overdraft"].includes(account.type)
      );
      if (!vm.accounts.length) {
        vm.accounts = allAccounts;
      }

      vm.form = {
        account: null,
        issuerName: "",
        chequeNumber: "",
        chequeAlpha: "",
        chequeDate: "",
        chequeAmount: "",
        beneficiaryName: "",
        transactionPassword: "",
      };
      vm.formError = "";
      vm.statusMessage = "";
      vm.step = "form";
      vm.isSuccess = true;

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
        vm.statusMessage = "";
        if (!vm.form.account) {
          vm.formError = "Select an account number.";
          return;
        }
        if (!vm.form.issuerName) {
          vm.formError = "Enter issuer name.";
          return;
        }
        if (!vm.form.chequeNumber) {
          vm.formError = "Enter cheque number.";
          return;
        }
        if (!vm.form.chequeAlpha) {
          vm.formError = "Enter cheque alpha.";
          return;
        }
        if (!vm.form.chequeDate) {
          vm.formError = "Select cheque date.";
          return;
        }
        if (!vm.form.chequeAmount) {
          vm.formError = "Enter cheque amount.";
          return;
        }
        const amount = Number(String(vm.form.chequeAmount).replace(/,/g, ""));
        if (!Number.isFinite(amount)) {
          vm.formError = "Enter a valid cheque amount.";
          return;
        }
        if (amount < 50000) {
          vm.formError = "Cheque amount must be at least 50000.";
          return;
        }
        const issuedMatch = MOCK_CHEQUE_STATUS ? MOCK_CHEQUE_STATUS[vm.form.chequeNumber] : null;
        if (issuedMatch && issuedMatch.account !== vm.form.account) {
          vm.formError = "Cheque number is not linked to the selected account.";
          return;
        }
        const chequeNumberValue = Number(vm.form.chequeNumber);
        const isInUnusedRange =
          MOCK_CHEQUE_UNUSED_RANGE &&
          Number.isFinite(chequeNumberValue) &&
          chequeNumberValue >= MOCK_CHEQUE_UNUSED_RANGE.start &&
          chequeNumberValue <= MOCK_CHEQUE_UNUSED_RANGE.end;
        if (issuedMatch || isInUnusedRange) {
          if (
            isInUnusedRange &&
            MOCK_CHEQUE_UNUSED_RANGE.account &&
            MOCK_CHEQUE_UNUSED_RANGE.account !== vm.form.account
          ) {
            vm.formError = "Cheque number is not linked to the selected account.";
            return;
          }
        } else {
          vm.formError = "Cheque number is not issued.";
          return;
        }
        if (!vm.form.beneficiaryName) {
          vm.formError = "Enter beneficiary name.";
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
        $timeout(() => {
          vm.statusMessage = "PPS request submitted successfully.";
          vm.step = "success";
        }, 200);
      };

      vm.newRequest = function () {
        vm.step = "form";
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
    ]);
})();
