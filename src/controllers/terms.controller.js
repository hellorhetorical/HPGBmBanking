(() => {
  "use strict";

  const { APP_NAME, BANK_NAME, BANK_SHORT_NAME, TERMS_URL } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("TermsController", [
    "$location",
    "$rootScope",
    function ($location, $rootScope) {
      const vm = this;

      const shortName = BANK_SHORT_NAME || "bankshortname";
      vm.appName = APP_NAME || `${shortName}mBanking`;
      vm.bankName = BANK_NAME || "bankname";
      vm.showFullTerms = false;
      vm.termsUrl = TERMS_URL || "";

      vm.acceptTerms = function () {
        if (typeof $rootScope.setTermsAccepted === "function") {
          $rootScope.setTermsAccepted(true);
        }
        $location.path("/");
      };

      vm.toggleFullTerms = function () {
        vm.showFullTerms = !vm.showFullTerms;
      };
    },
  ]);
})();
