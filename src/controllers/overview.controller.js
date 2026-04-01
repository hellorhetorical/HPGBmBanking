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
    LOCATE_BRANCH_URL,
    WHATSAPP_BANKING_NUMBER,
    WHATSAPP_BASE_URL,
    HOLIDAYS_LIST_URL,
    BANK_SHORT_NAME,
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
    DEMO_MODE,
    APP_NAME,
    BANK_NAME,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("OverviewController", [
      "$rootScope",
      "$timeout",
      "$location",
      "$window",
      "SecurityService",
      function ($rootScope, $timeout, $location, $window, SecurityService) {
      const vm = this;
      const defaultUser = DEFAULT_USER;
      vm.title = "Overview";
      vm.subtitle = "Start wiring up your experience.";
      vm.useMockLogin = USE_MOCK_LOGIN;
      vm.demoMode = DEMO_MODE;
      const shortName = BANK_SHORT_NAME || "bankshortname";
      vm.appName = APP_NAME || `${shortName}mBanking`;
      vm.bankName = BANK_NAME || "bankname";
      vm.locateBranchUrl = LOCATE_BRANCH_URL || "";
      const whatsappBaseUrl = WHATSAPP_BASE_URL || "";
      vm.whatsappBankingUrl = WHATSAPP_BANKING_NUMBER && whatsappBaseUrl
        ? `${whatsappBaseUrl}${WHATSAPP_BANKING_NUMBER}`
        : "";
      vm.holidaysListUrl = HOLIDAYS_LIST_URL || "";
      vm.login = {
        username: "",
        password: "",
        otp: "",
      };
      vm.error = "";
      vm.bindResult = null;
      vm.isLoginSubmitting = false;

      if ($rootScope.bindResult) {
        vm.bindResult = $rootScope.bindResult;
        $timeout(() => {
          vm.bindResult = null;
          $rootScope.bindResult = null;
        }, 4500);
      }

      vm.goBindDevice = function () {
        $location.path("/binddevice");
      };

      const PIN_UPDATED_AT_KEY = "hpgb.auth.pinUpdatedAt";
      const DEFAULT_PIN_SETUP_PERIOD_DAYS = 30;

      const parseTimestamp = function (value) {
        if (value === undefined || value === null || value === "") {
          return 0;
        }
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
          return numeric;
        }
        const parsedDate = Date.parse(value);
        return Number.isFinite(parsedDate) && parsedDate > 0 ? parsedDate : 0;
      };

      const getPinSetupIntervalMs = function () {
        const days = Number(MOCK_LOGIN.pinSetupPeriodDays || DEFAULT_PIN_SETUP_PERIOD_DAYS);
        const safeDays = Number.isFinite(days) && days > 0 ? days : DEFAULT_PIN_SETUP_PERIOD_DAYS;
        return safeDays * 24 * 60 * 60 * 1000;
      };

      const getStoredPinUpdatedAt = function () {
        try {
          const value = $window.localStorage.getItem(PIN_UPDATED_AT_KEY);
          return parseTimestamp(value);
        } catch (error) {
          return 0;
        }
      };

      const getMockPinUpdatedAt = function () {
        return parseTimestamp(MOCK_LOGIN.pinUpdatedAt);
      };

      const getEffectivePinUpdatedAt = function () {
        return getStoredPinUpdatedAt() || getMockPinUpdatedAt();
      };

      const shouldRequirePinSetup = function () {
        if (!USE_MOCK_LOGIN) {
          return false;
        }
        const updatedAt = getEffectivePinUpdatedAt();
        if (!updatedAt) {
          return Number(MOCK_LOGIN.login || 0) === 0;
        }
        return Date.now() - updatedAt >= getPinSetupIntervalMs();
      };


      const sanitizeUserId = function (value) {
        const raw = (value || "").toString().trim().toUpperCase();
        return raw.replace(/[^A-Z0-9]/g, "").slice(0, 9);
      };

      vm.loginUser = async function () {
        vm.login.username = sanitizeUserId(vm.login.username);
        if (!vm.login.username) {
          vm.error = "Please enter your User ID.";
          return;
        }
        if (!DEMO_MODE) {
          vm.error = "Login is disabled in non-demo builds.";
          return;
        }
        if (!vm.login.password) {
          vm.error = "Please enter your Login PIN.";
          return;
        }
        if (
          USE_MOCK_LOGIN &&
          (vm.login.username !== MOCK_LOGIN.username || vm.login.password !== MOCK_LOGIN.password)
        ) {
          vm.error = "Invalid User ID or Login PIN.";
          return;
        }
        if (shouldRequirePinSetup()) {
          $rootScope.firstLoginSetup = {
            userId: vm.login.username,
            name: defaultUser.name || vm.login.username,
          };
          $location.path("/first-login").search({ userId: vm.login.username });
          return;
        }
        vm.error = "";
        try {
          await SecurityService.setMpin(vm.login.password);
        } catch (error) {
          vm.error = error && error.message ? error.message : "Unable to securely store MPIN.";
          return;
        }
        $rootScope.currentUser = {
          name: defaultUser.name || vm.login.username,
          userId: vm.login.username,
        };
        $rootScope.lastLoginAt = new Date().toISOString();
        saveSession(null, {
          user: $rootScope.currentUser,
          lastLoginAt: $rootScope.lastLoginAt,
          expiresAt: SESSION_DURATION_MS ? Date.now() + SESSION_DURATION_MS : null,
        });
        SecurityService.markUnlocked();
        $rootScope.isAuthenticated = true;
        $location.path("/home");
      };

      vm.submitLogin = function ($event) {
        if ($event && typeof $event.preventDefault === "function") {
          $event.preventDefault();
        }
        if (vm.isLoginSubmitting) {
          return;
        }
        vm.isLoginSubmitting = true;
        const activeElement = $window.document && $window.document.activeElement;
        if (activeElement && typeof activeElement.blur === "function") {
          activeElement.blur();
        }
        $timeout(async () => {
          try {
            await vm.loginUser();
          } finally {
            vm.isLoginSubmitting = false;
            $rootScope.$applyAsync();
          }
        }, 0);
      };
      },
    ]);
})();
