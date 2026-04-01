(() => {
  "use strict";

  const { DEFAULT_HOME_SECTIONS } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("SearchController", function ($location) {
    const vm = this;
    const baseSections = Array.isArray(DEFAULT_HOME_SECTIONS) ? DEFAULT_HOME_SECTIONS : [];

    const normalizeQuery = function (value) {
      return (value || "").toString().toLowerCase().trim();
    };

    const filterSections = function (query) {
      const needle = normalizeQuery(query);
      if (!needle) {
        return baseSections;
      }
      return baseSections
        .map((section) => {
          const items = (section.items || []).filter((item) =>
            normalizeQuery(item.label).includes(needle)
          );
          if (!items.length) {
            return null;
          }
          return { ...section, items };
        })
        .filter(Boolean);
    };

    const updateResults = function () {
      vm.sections = filterSections(vm.searchQuery);
      vm.hasResults = (vm.sections || []).some((section) => (section.items || []).length);
    };

    vm.searchQuery = "";
    vm.sections = [];
    vm.hasResults = true;

    vm.updateSearch = function () {
      updateResults();
    };

    vm.goTo = function (route) {
      if (!route) {
        return;
      }
      $location.path(route.path).search(route.query || {});
    };

    updateResults();
  });
})();
