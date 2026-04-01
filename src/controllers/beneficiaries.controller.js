(() => {
  "use strict";

  const {
    MOCK_DATA,
    MOCK_CONFIG,
    USE_MOCK_DATA,
    getMockList,
    getMockObject,
    getFirst,
    getConfigList,
    getConfigObject,
    getConfigValue,
    DEFAULT_DEVICE_ID,
    DEFAULT_USER,
    DEFAULT_CARD_PIN,
    DEFAULT_DEBIT_CARD_NUMBER,
    DEFAULT_DEBIT_CARD_EXPIRY,
    DEFAULT_HOME_HIGHLIGHT_ACCOUNTS,
    DEFAULT_HOME_SECTIONS,
    DEFAULT_DEPOSIT_ACTIONS,
    DEFAULT_TRANSFER_TRANSACTION_TYPES,
    DEFAULT_ACCOUNT_VIEW_TABS,
    DEFAULT_LIMIT_MANAGEMENT_ITEMS,
    DEFAULT_LIMIT_STANDARD_LIMITS,
    DEFAULT_FD_TYPES,
    DEFAULT_FD_TYPE_TAX_SAVER,
    DEFAULT_FD_RATES,
    DEFAULT_FD_PARTIAL_WITHDRAWALS,
    DEFAULT_FD_MATURITY_INSTRUCTIONS_DEFAULT,
    DEFAULT_FD_MATURITY_INSTRUCTIONS_TAX_SAVER,
    DEFAULT_FD_MATURITY_INSTRUCTION_AUTO_CLOSE,
    DEFAULT_FD_TAX_SAVER_TENURE_YEARS,
    DEFAULT_FD_TAX_SAVER_TENURE_MONTHS,
    DEFAULT_FD_TAX_SAVER_TENURE_DAYS,
    DEFAULT_FD_NOMINEE_OPTIONS,
    DEFAULT_FD_INTEREST_OPTIONS,
    DEFAULT_FD_CLOSURE_BASE_RATE,
    DEFAULT_FD_STATUS_INTEREST_RATE,
    DEFAULT_RD_NOMINEE_OPTIONS,
    DEFAULT_RD_SCHEDULE_OPTIONS,
    DEFAULT_RD_PAYMENT_DATES,
    DEFAULT_RD_INTEREST_RATE_LABEL,
    DEFAULT_FD_STATUS_DETAIL,
    DEFAULT_RD_STATUS_DETAIL,
    DEFAULT_MINI_STATEMENT_TYPE_MAP,
    DEFAULT_MINI_STATEMENT_DEFAULT_TYPE,
    DEFAULT_COMPOUNDING_MAP,
    MOCK_LOGIN,
    USE_MOCK_LOGIN,
    MOCK_CARD_PIN,
    MOCK_DEVICE_ID,
    MOCK_ACCOUNTS,
    MOCK_RD_ACCOUNTS,
    SESSION_KEY,
    SESSION_DURATION_MS,
    isMockTransactionPasswordValid,
    saveSession,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("BeneficiariesController", [
      "$location",
      "$rootScope",
    "$scope",
    "$timeout",
    "$window",
    function ($location, $rootScope, $scope, $timeout, $window) {
        const vm = this;
        vm.title = "My Payees";
        vm.subtitle = "Manage your saved beneficiaries and bank details.";
        vm.search = "";
        vm.showAddSheet = false;
        vm.payees = Array.isArray($rootScope.beneficiariesList)
          ? $rootScope.beneficiariesList
          : [];
        vm.filteredPayees = vm.payees;
        let filterTimer = null;

        const filterPayees = function () {
          const needle = (vm.search || "").trim().toLowerCase();
          if (!needle) {
            return vm.payees;
          }
          return vm.payees.filter((payee) => {
            const account = (payee.account || "").toString().toLowerCase();
            const name = (payee.name || "").toString().toLowerCase();
            const bank = (payee.bank || "").toString().toLowerCase();
            const initials = (payee.initials || "").toString().toLowerCase();
            return (
              account.includes(needle) ||
              name.includes(needle) ||
              bank.includes(needle) ||
              initials.includes(needle)
            );
          });
        };

        const scheduleFilter = function () {
          if (filterTimer) {
            $timeout.cancel(filterTimer);
          }
          filterTimer = $timeout(() => {
            vm.filteredPayees = filterPayees();
          }, 120);
        };

        vm.lastActiveElement = null;

        vm.openAddSheet = function () {
          vm.lastActiveElement = $window.document.activeElement;
          vm.showAddSheet = true;
          $timeout(() => {
            const firstOption = $window.document.getElementById("beneficiary-add-same");
            if (firstOption && typeof firstOption.focus === "function") {
              firstOption.focus();
              return;
            }
            const sheet = $window.document.querySelector(".beneficiary-sheet.open");
            if (sheet && typeof sheet.focus === "function") {
              sheet.focus();
            }
          }, 0);
        };

        vm.closeAddSheet = function () {
          vm.showAddSheet = false;
          $timeout(() => {
            if (vm.lastActiveElement && typeof vm.lastActiveElement.focus === "function") {
              vm.lastActiveElement.focus();
            }
          }, 0);
        };

        vm.startAdd = function (type) {
          vm.showAddSheet = false;
          $location.path("/beneficiaries/add").search({ type });
        };

        $rootScope.$watch(
          () => $rootScope.beneficiariesList,
          (value) => {
            if (Array.isArray(value)) {
              vm.payees = value;
              scheduleFilter();
            }
          }
        );

        $scope.$watch(
          () => vm.search,
          () => {
            scheduleFilter();
          }
        );

        $scope.$on("$destroy", () => {
          if (filterTimer) {
            $timeout.cancel(filterTimer);
          }
        });
      },
    ]);
})();
