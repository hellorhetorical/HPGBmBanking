(() => {
  "use strict";

  angular.module("hpgbmbanking").controller("NewUserSuccessController", [
    "$location",
    "$rootScope",
    function ($location, $rootScope) {
      const vm = this;
      const flow = $rootScope.newUserFlow;
      const params = $location.search();

      if (!flow || !flow.accountNumber || !flow.mpin) {
        $location.path("/new-user");
        return;
      }
      if (!params.account || String(params.account) !== String(flow.accountNumber)) {
        $location.path("/new-user").search({});
        return;
      }

      vm.accountNumber = flow.accountNumber;
      vm.facility = flow.facility;
      vm.generatedUserId = `U${String(flow.accountNumber).slice(-8)}`;

      vm.goLogin = function () {
        $rootScope.newUserFlow = null;
        $location.path("/").search({});
      };
    },
  ]);
})();
