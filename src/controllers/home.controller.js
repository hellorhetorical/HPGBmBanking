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

  angular.module("hpgbmbanking").controller("HomeController", function ($rootScope, $window, $location, $timeout) {
      const vm = this;
      const HOME_SCROLL_KEY = "hpgb.home.scrollY";
      const defaultUser = DEFAULT_USER;
      let sliderElement = null;
      let sliderScrollHandler = null;
      vm.user = $rootScope.currentUser || defaultUser;
      vm.lastLoginAt = $rootScope.lastLoginAt;
      $rootScope.$watch(
        () => $rootScope.lastLoginAt,
        (value) => {
          vm.lastLoginAt = value;
        }
      );
      vm.getLastLoginLabel = function () {
        if (!vm.lastLoginAt) {
          return "Last login: --";
        }
        const date = new Date(vm.lastLoginAt);
        if (Number.isNaN(date.getTime())) {
          return "Last login: --";
        }
        const datePart = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const timePart = date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `Last login: ${datePart}, ${timePart}`;
      };
      vm.activeAccountIndex = 0;
      vm.sliderReady = false;
      vm.highlightAccounts = DEFAULT_HOME_HIGHLIGHT_ACCOUNTS;

      const formatMaskedNumber = function (number) {
        const digits = (number || "").toString().replace(/\D/g, "");
        const last4 = digits.slice(-4);
        if (!last4) {
          return ".... .... .... ....";
        }
        return `.... .... .... ${last4}`;
      };

      vm.getMaskedNumber = function (account) {
        return formatMaskedNumber(account.number);
      };

      vm.setActiveAccount = function (index) {
        vm.activeAccountIndex = index;
        const slider = $window.document.querySelector(".home-highlight-slider");
        if (!slider) {
          return;
        }
        const card = slider.querySelector(".home-highlight-card");
        if (!card) {
          return;
        }
        const gap = 12;
        const cardWidth = card.offsetWidth + gap;
        slider.scrollTo({ left: cardWidth * index, behavior: "smooth" });
      };

      vm.onHighlightKeydown = function (event) {
        if (!event) {
          return;
        }
        const key = event.key;
        if (key === "ArrowRight") {
          event.preventDefault();
          const nextIndex = Math.min(
            vm.activeAccountIndex + 1,
            vm.highlightAccounts.length - 1
          );
          vm.setActiveAccount(nextIndex);
          return;
        }
        if (key === "ArrowLeft") {
          event.preventDefault();
          const prevIndex = Math.max(vm.activeAccountIndex - 1, 0);
          vm.setActiveAccount(prevIndex);
          return;
        }
        if (key === "Home") {
          event.preventDefault();
          vm.setActiveAccount(0);
          return;
        }
        if (key === "End") {
          event.preventDefault();
          vm.setActiveAccount(vm.highlightAccounts.length - 1);
        }
      };

      vm.initSlider = function () {
        if (vm.sliderReady) {
          return;
        }
        const slider = $window.document.querySelector(".home-highlight-slider");
        if (!slider) {
          return;
        }
        vm.sliderReady = true;
        sliderElement = slider;
        sliderScrollHandler = () => {
          const card = slider.querySelector(".home-highlight-card");
          if (!card) {
            return;
          }
          const gap = 12;
          const cardWidth = card.offsetWidth + gap;
          const index = Math.round(slider.scrollLeft / cardWidth);
          if (index !== vm.activeAccountIndex) {
            vm.activeAccountIndex = Math.max(
              0,
              Math.min(index, vm.highlightAccounts.length - 1)
            );
            $rootScope.$applyAsync();
          }
        };
        slider.addEventListener("scroll", sliderScrollHandler, { passive: true });
      };

      vm.toggleAccountDetails = function (account) {
        account.showDetails = !account.showDetails;
        if (account.hideTimer) {
          $timeout.cancel(account.hideTimer);
          account.hideTimer = null;
        }
        if (account.showDetails) {
          account.hideTimer = $timeout(() => {
            account.showDetails = false;
            account.hideTimer = null;
          }, 10000);
        }
      };

      vm.goTo = function (route) {
        if (!route) {
          return;
        }
        $location.path(route.path).search(route.query || {});
      };
      vm.sections = DEFAULT_HOME_SECTIONS;

      const getScrollTop = function () {
        const doc = $window.document.documentElement;
        return $window.pageYOffset || doc.scrollTop || $window.document.body.scrollTop || 0;
      };

      if (typeof $rootScope.homeScrollY === "undefined") {
        $rootScope.homeScrollY = 0;
      }
      const saveScrollTop = function () {
        $rootScope.homeScrollY = getScrollTop();
      };

      const restoreScrollTop = function () {
        $window.scrollTo(0, $rootScope.homeScrollY || 0);
      };

      const stopRouteListener = $rootScope.$on("$routeChangeStart", (event, next, current) => {
        if (current && current.originalPath === "/home") {
          saveScrollTop();
        }
      });

      const stopViewListener = $rootScope.$on("$viewContentLoaded", () => {
        if ($location.path() !== "/home") {
          return;
        }
        $window.setTimeout(restoreScrollTop, 0);
      });

      $rootScope.$on("$destroy", () => {
        stopRouteListener();
        stopViewListener();
        if (sliderElement && sliderScrollHandler) {
          sliderElement.removeEventListener("scroll", sliderScrollHandler);
          sliderElement = null;
          sliderScrollHandler = null;
        }
        vm.highlightAccounts.forEach((account) => {
          if (account.hideTimer) {
            $timeout.cancel(account.hideTimer);
            account.hideTimer = null;
          }
        });
      });
    });
})();
