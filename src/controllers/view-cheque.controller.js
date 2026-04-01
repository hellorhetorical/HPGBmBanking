(() => {
  "use strict";

  const { MOCK_ACCOUNTS, MOCK_CHEQUE_STATUS, MOCK_CHEQUE_UNUSED_RANGE } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("ViewChequeController", [
      "$timeout",
      function ($timeout) {
      const vm = this;
      vm.title = "View Cheque";
      vm.subtitle = "Check cheque status for your account.";

      const allAccounts = Array.isArray(MOCK_ACCOUNTS) ? MOCK_ACCOUNTS : [];
      vm.accounts = allAccounts.filter((account) =>
        ["Savings", "Current", "Overdraft"].includes(account.type)
      );
      if (!vm.accounts.length) {
        vm.accounts = allAccounts;
      }

      vm.form = {
        account: null,
        chequeNumber: "",
      };
      vm.formError = "";
      vm.statusMessage = "";
      vm.detail = null;

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

      vm.search = function () {
        vm.formError = "";
        vm.statusMessage = "";
        vm.detail = null;
        if (!vm.form.account) {
          vm.formError = "Select an account number.";
          return;
        }
        if (!vm.form.chequeNumber) {
          vm.formError = "Enter cheque number.";
          return;
        }
        const inputNumber = Number(vm.form.chequeNumber);
        const match = MOCK_CHEQUE_STATUS ? MOCK_CHEQUE_STATUS[vm.form.chequeNumber] : null;
        if (match && match.account !== vm.form.account) {
          vm.formError = "Cheque number is not linked to the selected account.";
          return;
        }
        if (match) {
          vm.detail = {
            number: vm.form.chequeNumber,
            status: match.status,
            reason: match.reason,
          };
          vm.statusMessage = `Cheque No. ${vm.form.chequeNumber} is ${match.status}.`;
          return;
        }
        if (
          MOCK_CHEQUE_UNUSED_RANGE &&
          Number.isFinite(inputNumber) &&
          inputNumber >= MOCK_CHEQUE_UNUSED_RANGE.start &&
          inputNumber <= MOCK_CHEQUE_UNUSED_RANGE.end
        ) {
          if (MOCK_CHEQUE_UNUSED_RANGE.account && MOCK_CHEQUE_UNUSED_RANGE.account !== vm.form.account) {
            vm.formError = "Cheque number is not linked to the selected account.";
            return;
          }
          vm.detail = {
            number: vm.form.chequeNumber,
            status: "Unused",
            reason: "Issued but not used",
          };
          vm.statusMessage = `Cheque No. ${vm.form.chequeNumber} is Unused.`;
          return;
        }
        vm.formError = "Cheque number is not issued.";
      };
    },
    ]);
})();
