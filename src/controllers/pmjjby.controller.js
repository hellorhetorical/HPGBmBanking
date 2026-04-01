(() => {
  "use strict";

  const { MOCK_ACCOUNTS, getFirst, isMockTransactionPasswordValid } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("PmjjbyController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Pradhan Mantri Jeevan Jyoti Bima Yojana";
      vm.subtitle = "Secure life cover with annual auto-debit.";

      const allAccounts = Array.isArray(MOCK_ACCOUNTS) ? MOCK_ACCOUNTS : [];
      const savingsAccounts = allAccounts.filter((account) => account.type === "Savings");
      vm.accounts = savingsAccounts.length ? savingsAccounts : allAccounts;
      vm.nomineeRelations = [
        "BROTHER",
        "DAUGHTER",
        "FATHER IN LAW",
        "GRANDDAUGHTER",
        "GRANDFATHER",
        "GRANDMOTHER",
        "GRANDSON",
        "HUSBAND",
        "MOTHER",
        "MOTHER IN LAW",
        "OTHERS",
        "SELF",
        "SISTER",
        "SISTER IN LAW",
        "SON",
        "WIFE",
      ];

      vm.step = "terms";
      vm.acceptedTerms = false;
      vm.formError = "";
      vm.statusMessage = "";
      vm.isSuccess = true;

      vm.form = {
        account: null,
        nomineeName: "",
        nomineeDob: "",
        nomineeRelation: null,
        nomineeAddress: "",
        nomineePin: "",
        nomineeMinor: "No",
        guardianName: "",
        guardianAddress: "",
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

      vm.viewTerms = function () {
        vm.step = "terms-detail";
      };

      vm.backToTerms = function () {
        vm.step = "terms";
      };

      vm.continueFromTerms = function () {
        if (!vm.acceptedTerms) {
          return;
        }
        vm.step = "form";
      };

      vm.continueFromForm = function () {
        vm.formError = "";
        if (!vm.form.account) {
          vm.formError = "Select an account number.";
          return;
        }
        if (!vm.form.nomineeName) {
          vm.formError = "Enter nominee name.";
          return;
        }
        if (!vm.form.nomineeDob) {
          vm.formError = "Select nominee date of birth.";
          return;
        }
        if (!vm.form.nomineeRelation) {
          vm.formError = "Select nominee relation.";
          return;
        }
        if (!vm.form.nomineeAddress) {
          vm.formError = "Enter nominee address.";
          return;
        }
        if (!vm.form.nomineePin) {
          vm.formError = "Enter nominee address PIN.";
          return;
        }
        if (!/^\d{6}$/.test(vm.form.nomineePin)) {
          vm.formError = "Nominee address PIN must be 6 digits.";
          return;
        }
        const nomineeDob = new Date(vm.form.nomineeDob);
        if (Number.isNaN(nomineeDob.getTime())) {
          vm.formError = "Select a valid nominee date of birth.";
          return;
        }
        const today = new Date();
        let age = today.getFullYear() - nomineeDob.getFullYear();
        const monthDelta = today.getMonth() - nomineeDob.getMonth();
        if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < nomineeDob.getDate())) {
          age -= 1;
        }
        if (vm.form.nomineeMinor === "Yes" && age >= 18) {
          vm.formError = "Nominee age must be below 18 for minor selection.";
          return;
        }
        if (vm.form.nomineeMinor === "No" && age < 18) {
          vm.formError = "Nominee age indicates minor. Select Yes for minor.";
          return;
        }
        if (vm.form.nomineeMinor === "Yes") {
          if (!vm.form.guardianName) {
            vm.formError = "Enter guardian name.";
            return;
          }
          if (!vm.form.guardianAddress) {
            vm.formError = "Enter guardian address.";
            return;
          }
        }
        vm.step = "confirm";
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

      vm.newRequest = function () {
        vm.step = "terms";
      };
    },
    ]);
})();
