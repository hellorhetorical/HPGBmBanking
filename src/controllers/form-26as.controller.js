(() => {
  "use strict";

  const { MOCK_DATA, DEFAULT_USER, readSession, FORM_26AS_URL } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("Form26asController", [
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

      vm.title = "Form 26 AS Generation";
      vm.subtitle = "Review your details and generate the statement.";
      vm.step = "form";
      vm.error = "";
      vm.form26asUrl = FORM_26AS_URL || "";

      vm.form = {
        customerId: (activeUser && activeUser.userId) || "",
        pan: (activeUser && activeUser.pan) || "",
      };

      vm.initial = (vm.form.customerId || "U").charAt(0).toUpperCase();

      vm.viewForm = function () {
        vm.error = "";
        if (!vm.form.customerId) {
          vm.error = "Customer ID is required.";
          return;
        }
        if (!vm.form.pan) {
          vm.error = "Unique Transaction Number is required.";
          return;
        }
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
  ]);
})();
