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
    DEFAULT_TOLL_FREE,
    BANK_SHORT_NAME,
    APP_NAME,
    BANK_NAME,
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

  angular.module("hpgbmbanking").controller("LockController", function ($rootScope, $location, SecurityService) {
    const vm = this;

    vm.mpinDigits = ["", "", "", ""];
    vm.error = "";
    vm.statusMessage = "";
    vm.showBiometric = false;
    const shortName = BANK_SHORT_NAME || "bankshortname";
    vm.appName = APP_NAME || `${shortName}mBanking`;
    vm.bankName = BANK_NAME || "bankname";
    vm.tollfree = DEFAULT_TOLL_FREE || "tollfree";
    vm.userName = ($rootScope.currentUser && $rootScope.currentUser.name) || "";

    const goNext = () => {
      const target = SecurityService.consumeIntendedPath() || "/home";
      $location.path(target);
    };

    const unlockWithMpin = async function () {
      vm.error = "";
      const value = vm.mpinDigits.join("");
      if (!/^\d{4}$/.test(value)) {
        return;
      }
      const ok = await SecurityService.verifyMpin(value);
      if (!ok) {
        vm.error = "Incorrect MPIN.";
        vm.mpinDigits = ["", "", "", ""];
        $rootScope.$applyAsync();
        return;
      }
      goNext();
      $rootScope.$applyAsync();
    };

    vm.onPasscodeKeyup = function (index, event) {
      const key = event && event.key ? event.key : "";
      if (key === "Backspace" && !vm.mpinDigits[index] && index > 0) {
        const prev = event.target && event.target.parentElement
          ? event.target.parentElement.querySelectorAll("input")[index - 1]
          : null;
        if (prev) {
          prev.focus();
        }
        return;
      }
      const value = (vm.mpinDigits[index] || "").replace(/\D/g, "");
      vm.mpinDigits[index] = value;
      if (value && index < 3) {
        const next = event.target && event.target.parentElement
          ? event.target.parentElement.querySelectorAll("input")[index + 1]
          : null;
        if (next) {
          next.focus();
        }
      }
      if (vm.mpinDigits.every((digit) => digit && digit.length === 1)) {
        unlockWithMpin();
      } else {
        $rootScope.$applyAsync();
      }
    };

    vm.tryBiometric = async function () {
      vm.error = "";
      vm.statusMessage = "";
      try {
        await SecurityService.tryBiometricUnlock();
        goNext();
      } catch (error) {
        vm.error = error && error.message ? error.message : "Biometric unlock failed.";
      }
      $rootScope.$applyAsync();
    };

    SecurityService.ensureReady().then(() => {
      vm.showBiometric = SecurityService.isBiometricsEnabled();
      if (vm.showBiometric) {
        vm.statusMessage = "Use biometrics or enter MPIN to continue.";
        vm.tryBiometric();
      }
      $rootScope.$applyAsync();
    });
  });
})();
