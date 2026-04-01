(() => {
  "use strict";

  const { MOCK_ACCOUNTS, getFirst, isMockTransactionPasswordValid } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("ApyController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Atal Pension Yojana";
      vm.subtitle = "Build retirement security with flexible contributions.";

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
      vm.titles = ["Mr.", "Mrs.", "Ms."];
      vm.maritalStatuses = ["Married", "Single", "Divorced", "Widowed"];
      vm.otherSchemeOptions = ["Yes", "No"];
      vm.pensionAmounts = ["1000", "2000", "3000", "4000", "5000"];
      vm.incomeTaxOptions = ["Yes", "No"];
      vm.minorOptions = ["Yes", "No"];
      vm.contributionTypes = ["Monthly", "Quarterly", "Half-yearly"];

      vm.step = "terms";
      vm.acceptedTerms = false;
      vm.formError = "";
      vm.statusMessage = "";
      vm.isSuccess = true;

      vm.form = {
        account: null,
        title: null,
        maritalStatus: null,
        aadharPart1: "",
        aadharPart2: "",
        aadharPart3: "",
        otherScheme: null,
        pensionAmount: null,
        placeOfApplication: "",
        incomeTaxPayer: null,
        nomineeName: "",
        nomineeDob: "",
        nomineeRelation: null,
        nomineeMinor: null,
        guardianName: "",
        contributionType: null,
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
          vm.formError = "Select an account.";
          return;
        }
        if (!vm.form.title) {
          vm.formError = "Select title.";
          return;
        }
        if (!vm.form.maritalStatus) {
          vm.formError = "Select marital status.";
          return;
        }
        if (!/^\d{4}$/.test(vm.form.aadharPart1 || "")) {
          vm.formError = "Enter first 4 digits of Aadhar.";
          return;
        }
        if (!/^\d{4}$/.test(vm.form.aadharPart2 || "")) {
          vm.formError = "Enter middle 4 digits of Aadhar.";
          return;
        }
        if (!/^\d{4}$/.test(vm.form.aadharPart3 || "")) {
          vm.formError = "Enter last 4 digits of Aadhar.";
          return;
        }
        if (!vm.form.otherScheme) {
          vm.formError = "Select other scheme beneficiary status.";
          return;
        }
        if (!vm.form.pensionAmount) {
          vm.formError = "Select pension amount.";
          return;
        }
        if (!vm.form.placeOfApplication) {
          vm.formError = "Enter place of application.";
          return;
        }
        if (!vm.form.incomeTaxPayer) {
          vm.formError = "Select income tax payer status.";
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
        const nomineeDob = new Date(vm.form.nomineeDob);
        if (Number.isNaN(nomineeDob.getTime())) {
          vm.formError = "Select a valid nominee date of birth.";
          return;
        }
        if (!vm.form.nomineeRelation) {
          vm.formError = "Select nominee relation.";
          return;
        }
        if (!vm.form.nomineeMinor) {
          vm.formError = "Select nominee minor status.";
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
        if (vm.form.nomineeMinor === "Yes" && !vm.form.guardianName) {
          vm.formError = "Enter guardian name.";
          return;
        }
        if (!vm.form.contributionType) {
          vm.formError = "Select contribution type.";
          return;
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
