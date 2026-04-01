(() => {
  "use strict";

  angular.module("hpgbmbanking").controller("SmsPasswordController", [
    "$location",
    function ($location) {
      const vm = this;
      vm.title = "SMS Password";
      vm.step = "form";
      vm.error = "";
      vm.statusMessage = "";
      vm.form = {
        next: "",
        confirm: "",
      };

      vm.submit = function () {
        vm.error = "";
        if (!vm.form.next) {
          vm.error = "New SMS password is required.";
          return;
        }
        if (vm.form.next !== vm.form.confirm) {
          vm.error = "New SMS password and confirm password do not match.";
          return;
        }
        vm.statusMessage = "SMS password set successfully.";
        vm.completedAt = new Date();
        vm.step = "success";
      };

      vm.newRequest = function () {
        vm.step = "form";
        vm.error = "";
        vm.statusMessage = "";
        vm.completedAt = null;
        vm.form.next = "";
        vm.form.confirm = "";
      };

      vm.goProfile = function () {
        $location.path("/settings/profile");
      };
    },
  ]);
})();
