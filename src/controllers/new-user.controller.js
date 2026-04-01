(() => {
  "use strict";

  const { MOCK_DATA } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("NewUserController", [
    "$location",
    "$rootScope",
    function ($location, $rootScope) {
      const vm = this;
      const linkedAccounts = Array.isArray(MOCK_DATA && MOCK_DATA.MOCK_LINKED_ACCOUNTS)
        ? MOCK_DATA.MOCK_LINKED_ACCOUNTS.map((value) => String(value))
        : [];

      vm.form = {
        accountNumber: "",
        facility: "Transaction and View",
      };
      vm.error = "";

      const normalizeAccount = function (value) {
        return (value || "").toString().replace(/\D/g, "").slice(0, 18);
      };

      vm.continue = function () {
        vm.error = "";
        vm.form.accountNumber = normalizeAccount(vm.form.accountNumber);
        if (!vm.form.accountNumber) {
          vm.error = "Please enter account number.";
          return;
        }

        if (linkedAccounts.includes(vm.form.accountNumber)) {
          vm.error = "This account is already linked with a User ID.";
          return;
        }

        $rootScope.newUserFlow = {
          accountNumber: vm.form.accountNumber,
          facility: vm.form.facility || "Transaction and View",
        };
        $location.path("/new-user-otp").search({ account: vm.form.accountNumber });
      };

      vm.goBack = function () {
        $location.path("/");
      };
    },
  ]);
})();
