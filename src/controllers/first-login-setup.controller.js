(() => {
  "use strict";

  angular.module("hpgbmbanking").controller("FirstLoginSetupController", [
    "$location",
    "$rootScope",
    function ($location, $rootScope) {
      const vm = this;
      const pending = $rootScope.firstLoginSetup;
      const params = $location.search();

      if (!pending || !pending.userId || !params.userId || params.userId !== pending.userId) {
        $location.path("/");
        return;
      }

      vm.userId = pending.userId;
      vm.form = {
        mpin: "",
        mpinConfirm: "",
        tpin: "",
        tpinConfirm: "",
      };
      vm.error = "";

      const isValidPin = function (value) {
        return /^\d{4}$/.test((value || "").toString());
      };

      vm.goBack = function () {
        $location.path("/");
      };

      vm.continueToOtp = function () {
        vm.error = "";

        if (!vm.form.mpin || !vm.form.mpinConfirm || !vm.form.tpin || !vm.form.tpinConfirm) {
          vm.error = "Please enter and confirm both MPIN and TPIN.";
          return;
        }
        if (!isValidPin(vm.form.mpin)) {
          vm.error = "MPIN must be exactly 4 digits.";
          return;
        }
        if (!isValidPin(vm.form.tpin)) {
          vm.error = "TPIN must be exactly 4 digits.";
          return;
        }
        if (vm.form.mpin !== vm.form.mpinConfirm) {
          vm.error = "MPIN entries do not match.";
          return;
        }
        if (vm.form.tpin !== vm.form.tpinConfirm) {
          vm.error = "TPIN entries do not match.";
          return;
        }
        if (vm.form.mpin === vm.form.tpin) {
          vm.error = "MPIN and TPIN must be different.";
          return;
        }

        $rootScope.firstLoginSetup = {
          ...pending,
          mpin: vm.form.mpin,
          tpin: vm.form.tpin,
        };
        $location.path("/first-login-otp").search({ userId: vm.userId });
      };
    },
  ]);
})();
