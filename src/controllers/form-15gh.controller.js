(() => {
  "use strict";

  const {
    MOCK_DATA,
    DEFAULT_USER,
    readSession,
    isMockTransactionPasswordValid,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("Form15ghController", [
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

      vm.title = "Form 15G/H Submission";
      vm.subtitle = "Submit your declaration with verified personal details.";
      vm.step = "terms";
      vm.acceptedTerms = false;
      vm.error = "";
      vm.statusMessage = "";

      vm.viewTerms = function () {
        $location.path("/terms");
      };

      const buildAssessmentYears = function (startYear, count) {
        return Array.from({ length: count }, (_, index) => {
          const year = startYear - index;
          return `${year}-${year + 1}`;
        });
      };

      const refreshAssessmentYears = function () {
        const currentYear = new Date().getFullYear();
        vm.assessmentYears = buildAssessmentYears(currentYear, 5);
        if (!vm.assessmentYears.includes(vm.form.latestAssessmentYear)) {
          vm.form.latestAssessmentYear = vm.assessmentYears[0];
        }
      };

      vm.form = {
        customerName: activeUser && activeUser.name ? activeUser.name.toUpperCase() : "",
        pan: (activeUser && activeUser.pan) || "",
        dob: (activeUser && activeUser.dob) || "",
        mobile: (activeUser && activeUser.mobile) || "",
        residentialStatus: (activeUser && activeUser.residentialStatus) || "",
        email: (activeUser && activeUser.email) || "",
        pin: (activeUser && activeUser.pin) || "",
        address: (activeUser && activeUser.address) || "",
        assessedToTax: (activeUser && activeUser.assessedToTax) || "Yes",
        latestAssessmentYear: (activeUser && activeUser.latestAssessmentYear) || "",
        formType: "15G",
        estimatedIncome: (activeUser && activeUser.estimatedIncome) || "",
        otherIncome: (activeUser && activeUser.otherIncome) || "",
        formsFilled: (activeUser && activeUser.formsFilled) || "",
        aggregateAmount: (activeUser && activeUser.aggregateAmount) || "",
        transactionPassword: "",
      };
      refreshAssessmentYears();

      const updateFormTypeByDob = function () {
        const value = String(vm.form.dob || "").trim();
        if (!value) {
          return;
        }
        const parts = value.split("-");
        if (parts.length !== 3) {
          return;
        }
        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);
        if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
          return;
        }
        const birthDate = new Date(year, month - 1, day);
        if (Number.isNaN(birthDate.getTime())) {
          return;
        }
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age -= 1;
        }
        vm.form.formType = age >= 60 ? "15H" : "15G";
      };

      vm.onDobChange = function () {
        updateFormTypeByDob();
      };

      updateFormTypeByDob();

      vm.continueFromTerms = function () {
        vm.error = "";
        if (!vm.acceptedTerms) {
          vm.error = "Please accept the terms and conditions to continue.";
          return;
        }
        vm.step = "details";
      };

      vm.continueFromDetails = function () {
        vm.error = "";
        if (!vm.form.customerName) {
          vm.error = "Customer name is required.";
          return;
        }
        if (!vm.form.pan) {
          vm.error = "PAN is required.";
          return;
        }
        if (!vm.form.dob) {
          vm.error = "Date of birth is required.";
          return;
        }
        if (!vm.form.mobile) {
          vm.error = "Mobile number is required.";
          return;
        }
        if (!vm.form.residentialStatus) {
          vm.error = "Residential status is required.";
          return;
        }
        if (!vm.form.email) {
          vm.error = "E-mail ID is required.";
          return;
        }
        if (!vm.form.pin) {
          vm.error = "PIN code is required.";
          return;
        }
        if (!vm.form.address) {
          vm.error = "Address is required.";
          return;
        }
        vm.step = "assessment";
      };

      vm.submitForm = function () {
        vm.error = "";
        if (!vm.form.assessedToTax) {
          vm.error = "Select your tax assessment status.";
          return;
        }
        if (vm.form.assessedToTax === "Yes" && !vm.form.latestAssessmentYear) {
          vm.error = "Select the latest assessment year.";
          return;
        }
        if (!vm.form.estimatedIncome) {
          vm.error = "Estimated income is required.";
          return;
        }
        const otherIncome = Number(String(vm.form.otherIncome || "0").replace(/,/g, ""));
        if (!Number.isFinite(otherIncome) || otherIncome < 0) {
          vm.error = "Enter a valid income from other sources.";
          return;
        }
        if (otherIncome > 9999999) {
          vm.error = "Income from other sources cannot exceed 9999999.";
          return;
        }
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
        vm.statusMessage = "";
        $timeout(() => {
          vm.statusMessage = "Form 15G/H submitted successfully.";
          vm.step = "success";
        }, 200);
      };

      vm.newRequest = function () {
        vm.step = "terms";
        vm.acceptedTerms = false;
        vm.error = "";
        vm.statusMessage = "";
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
  ]);
})();
