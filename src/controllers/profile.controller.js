(() => {
  "use strict";

  angular.module("hpgbmbanking").controller("ProfileController", [
    function () {
      const vm = this;
      vm.title = "My Profile";
      vm.subtitle = "Manage Login PIN, TPIN, and profile settings.";
      vm.items = [
        { label: "Change Login PIN", route: "#!/settings/profile/sign-on" },
        { label: "Change TPIN", route: "#!/settings/profile/transaction" },
        { label: "Set SMS Password", route: "#!/settings/profile/sms" },
      ];
    },
  ]);
})();
