(() => {
  "use strict";

  const { isMockTransactionPasswordValid } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("TransactionPasswordController", [
    "$location",
    function ($location) {
      const vm = this;
      vm.title = "TPIN";
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
          vm.error = "Current TPIN is required.";
          return;
        }
        if (!vm.form.next) {
          vm.error = "New TPIN is required.";
          return;
        }
        if (vm.form.next !== vm.form.confirm) {
          vm.error = "New TPIN and confirm TPIN do not match.";
          return;
        }
        if (isMockTransactionPasswordValid && !isMockTransactionPasswordValid(vm.form.current)) {
          vm.error = "Current TPIN is incorrect.";
          return;
        }
        vm.statusMessage = "TPIN updated successfully.";
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
