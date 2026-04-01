(() => {
  "use strict";

  const { MOCK_ACCOUNTS, getFirst, isMockTransactionPasswordValid } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("PmsbyController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Pradhan Mantri Suraksha Bima Yojana";
      vm.subtitle = "Accident insurance cover with auto-debit premium.";

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
      vm.indiaStates = [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Andaman and Nicobar Islands",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Jammu and Kashmir",
        "Ladakh",
        "Lakshadweep",
        "Puducherry",
      ];

      vm.step = "terms";
      vm.acceptedTerms = false;
      vm.formError = "";
      vm.statusMessage = "";
      vm.isSuccess = true;

      vm.form = {
        account: null,
        email: "",
        fatherSpouseName: "",
        nomineeName: "",
        nomineeDob: "",
        nomineeRelation: null,
        nomineeAddress1: "",
        nomineeAddress2: "",
        nomineeCity: "",
        nomineeState: null,
        nomineePin: "",
        nomineeMinor: "No",
        guardianName: "",
        guardianAddress1: "",
        guardianAddress2: "",
        guardianCity: "",
        guardianState: null,
        guardianPin: "",
        disabled: "No",
        disabilityDetails: "",
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
        const fatherSpouseName = (vm.form.fatherSpouseName || "").trim();
        if (!fatherSpouseName) {
          vm.formError = "Enter father/spouse name.";
          return;
        }
        vm.form.fatherSpouseName = fatherSpouseName;
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
        if (!vm.form.nomineeAddress1) {
          vm.formError = "Enter nominee address line 1.";
          return;
        }
        if (!vm.form.nomineeCity) {
          vm.formError = "Enter nominee city.";
          return;
        }
        if (!vm.form.nomineeState) {
          vm.formError = "Enter nominee state.";
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
          if (!vm.form.guardianAddress1) {
            vm.formError = "Enter guardian address line 1.";
            return;
          }
          if (!vm.form.guardianCity) {
            vm.formError = "Enter guardian city.";
            return;
          }
          if (!vm.form.guardianState) {
            vm.formError = "Enter guardian state.";
            return;
          }
          if (!vm.form.guardianPin) {
            vm.formError = "Enter guardian address PIN.";
            return;
          }
          if (!/^\d{6}$/.test(vm.form.guardianPin)) {
            vm.formError = "Guardian address PIN must be 6 digits.";
            return;
          }
        }
        if (vm.form.disabled === "Yes" && !vm.form.disabilityDetails) {
          vm.formError = "Enter disability details.";
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
