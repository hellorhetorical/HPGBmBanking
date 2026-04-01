(() => {
  "use strict";

  angular.module("hpgbmbanking").factory("AccountContextService", function () {
    let selectedAccountNumber = null;

    return {
      setSelectedAccountNumber: (value) => {
        selectedAccountNumber = value || null;
      },
      getSelectedAccountNumber: () => selectedAccountNumber,
      clearSelectedAccountNumber: () => {
        selectedAccountNumber = null;
      },
    };
  });
})();
