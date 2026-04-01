(() => {
  "use strict";

  const { MOCK_LOGIN, USE_MOCK_LOGIN } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("SignOnPasswordController", [
    "$location",
    function ($location) {
      const vm = this;
      vm.title = "Login PIN";
      vm.step = "form";
      vm.error = "";
      vm.statusMessage = "";
      vm.form = {
        current: "",
        next: "",
        confirm: "",
      };

      vm.submit = function () {
        vm.error = "";
        if (!vm.form.current) {
          vm.error = "Current Login PIN is required.";
          return;
        }
        if (!vm.form.next) {
          vm.error = "New Login PIN is required.";
          return;
        }
        if (vm.form.next !== vm.form.confirm) {
          vm.error = "New Login PIN and confirm Login PIN do not match.";
          return;
        }
        if (USE_MOCK_LOGIN && vm.form.current !== (MOCK_LOGIN.password || "")) {
          vm.error = "Current Login PIN is incorrect.";
          return;
        }
        vm.statusMessage = "Login PIN updated successfully.";
        vm.completedAt = new Date();
        vm.step = "success";
      };

      vm.newRequest = function () {
        vm.step = "form";
        vm.error = "";
        vm.statusMessage = "";
        vm.completedAt = null;
        vm.form.current = "";
        vm.form.next = "";
        vm.form.confirm = "";
      };

      vm.goProfile = function () {
        $location.path("/settings/profile");
      };
    },
  ]);
})();
