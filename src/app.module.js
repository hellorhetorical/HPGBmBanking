(() => {
  "use strict";

  angular.module("hpgbmbanking", ["ngRoute"]).filter("maskAccount", function () {
    return function (value) {
      const digits = (value || "").toString().replace(/\D/g, "");
      const last4 = digits.slice(-4);
      return last4 ? `XXXXXXXXXXXX${last4}` : "";
    };
  });
})();
