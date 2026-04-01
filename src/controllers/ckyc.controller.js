(() => {
  "use strict";

  const {
    MOCK_DATA,
    DEFAULT_USER,
    readSession,
    isMockTransactionPasswordValid,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("CkycController", [
    "$location",
    "$window",
    function ($location, $window) {
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

      vm.title = "CKYC";
      vm.subtitle = "Review your CKYC status and details.";
      vm.step = "form";
      vm.error = "";
      vm.statusMessage = "";

      vm.form = {
        status: (activeUser && activeUser.ckycStatus) || "",
        compliedDate: (activeUser && activeUser.ckycCompliedDate) || "",
        number: (activeUser && activeUser.ckycNumber) || "",
        dueDate: (activeUser && activeUser.ckycDueDate) || "",
        transactionPassword: "",
      };

      vm.confirm = function () {
        vm.error = "";
        if (!vm.form.status) {
          vm.error = "KYC status is required.";
          return;
        }
        if (!vm.form.compliedDate) {
          vm.error = "KYC complied date is required.";
          return;
        }
        if (!vm.form.number) {
          vm.error = "CKYC number is required.";
          return;
        }
        if (!vm.form.dueDate) {
          vm.error = "KYC due date is required.";
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
        vm.statusMessage = "CKYC confirmed successfully.";
        vm.step = "success";
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
