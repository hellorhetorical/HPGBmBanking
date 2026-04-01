(() => {
  "use strict";

  const { BBPS_COMPLAINT_URL } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("BbpsController", [
    function () {
      const vm = this;
      const complaintUrl = BBPS_COMPLAINT_URL || "";

      vm.title = "Bill Pay";
      vm.subtitle = "Manage BBPS bill payments and complaints.";
      vm.items = [
        { label: "BBPS Bill Payment", icon: "receipt_long" },
        { label: "Transaction History", icon: "history" },
        {
          label: "Raise Complaint against Transaction",
          icon: "report",
          link: complaintUrl,
        },
        {
          label: "Track Complaint",
          icon: "track_changes",
          link: complaintUrl,
        },
      ];
    },
  ]);
})();
