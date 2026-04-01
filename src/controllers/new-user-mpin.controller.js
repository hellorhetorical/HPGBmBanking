(() => {
  "use strict";

  angular.module("hpgbmbanking").controller("NewUserMpinController", [
    "$location",
    "$rootScope",
    function ($location, $rootScope) {
      const vm = this;
      const flow = $rootScope.newUserFlow;
      const params = $location.search();

      if (!flow || !flow.accountNumber) {
        $location.path("/new-user");
        return;
      }
      if (!params.account || String(params.account) !== String(flow.accountNumber)) {
        $location.path("/new-user").search({});
        return;
      }

      vm.form = {
        mpin: "",
        mpinConfirm: "",
      };
      vm.error = "";

      const isValidPin = function (value) {
        return /^\d{4}$/.test((value || "").toString());
      };

      vm.submit = function () {
        vm.error = "";
        if (!vm.form.mpin || !vm.form.mpinConfirm) {
          vm.error = "Please enter and confirm MPIN.";
          return;
        }
        if (!isValidPin(vm.form.mpin)) {
          vm.error = "MPIN must be exactly 4 digits.";
          return;
        }
        if (vm.form.mpin !== vm.form.mpinConfirm) {
          vm.error = "MPIN entries do not match.";
          return;
        }

        flow.mpin = vm.form.mpin;
        $location.path("/new-user-success").search({ account: flow.accountNumber });
      };

      vm.goBack = function () {
        $location.path("/new-user-otp").search({ account: flow.accountNumber });
      };
    },
  ]);
})();
