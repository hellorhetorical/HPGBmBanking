(() => {
  "use strict";

  const { MOCK_ACCOUNTS, getFirst } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("InquireChequeController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Inquire Cheque Status";
      vm.subtitle = "Check cheque book status for your account.";

      const allAccounts = Array.isArray(MOCK_ACCOUNTS) ? MOCK_ACCOUNTS : [];
      vm.accounts = allAccounts.filter((account) =>
        ["Savings", "Current", "Overdraft"].includes(account.type)
      );
      if (!vm.accounts.length) {
        vm.accounts = allAccounts;
      }

      vm.form = {
        account: null,
        fromDate: "",
        toDate: "",
      };

      vm.formError = "";
      vm.showResult = false;
      vm.chequeBooks = [
        { id: "BK-333080", startNumber: "333080", chequeLeaves: 20 },
        { id: "BK-334120", startNumber: "334120", chequeLeaves: 10 },
      ];
      vm.selectedBook = null;
      vm.leafDetails = {
        "BK-333080": Array.from({ length: 20 }, (_, index) => ({
          number: String(333080 + index),
          status: index < 3 ? "Cleared" : index < 6 ? "In process" : "Unused",
        })),
        "BK-334120": Array.from({ length: 10 }, (_, index) => ({
          number: String(334120 + index),
          status: index < 2 ? "Cleared" : "Unused",
        })),
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

      vm.search = function () {
        vm.formError = "";
        if (!vm.form.account) {
          vm.formError = "Select an account number.";
          return;
        }
        if (!vm.form.fromDate) {
          vm.formError = "Select from date.";
          return;
        }
        if (!vm.form.toDate) {
          vm.formError = "Select to date.";
          return;
        }
        const fromDate = new Date(vm.form.fromDate);
        const toDate = new Date(vm.form.toDate);
        if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
          vm.formError = "Select valid dates.";
          return;
        }
        if (fromDate > toDate) {
          vm.formError = "From date cannot be after to date.";
          return;
        }
        vm.showResult = true;
        vm.selectedBook = null;
      };

      vm.reset = function () {
        vm.showResult = false;
        vm.selectedBook = null;
      };
    },
    ]);
})();
