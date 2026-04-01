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

  angular.module("hpgbmbanking").controller("SecurityController", function ($rootScope, $location, $window, SecurityService) {
    const vm = this;

    vm.title = "Security";
    vm.subtitle = "Passcode and biometrics";
    vm.passcode = {
      value: "",
      confirm: "",
    };
    vm.passcodeStatus = "";
    vm.passcodeError = "";
    vm.biometricError = "";
    vm.isPasscodeSet = false;
    vm.useBiometrics = false;

    const refreshStatus = () => {
      vm.isPasscodeSet = SecurityService.isPasscodeSet();
      vm.useBiometrics = SecurityService.isBiometricsEnabled();
      vm.passcodeStatus = SecurityService.getPasscodeStatus();
    };

    vm.savePasscode = async function () {
      vm.passcodeError = "";
      vm.passcodeStatus = "";
      const value = (vm.passcode.value || "").trim();
      const confirm = (vm.passcode.confirm || "").trim();
      if (!/^\d{4}$/.test(value)) {
        vm.passcodeError = "Passcode must be 4 digits.";
        $rootScope.$applyAsync();
        return;
      }
      if (value !== confirm) {
        vm.passcodeError = "Passcode and confirmation do not match.";
        $rootScope.$applyAsync();
        return;
      }
      try {
        await SecurityService.setPasscode(value);
      } catch (error) {
        vm.passcodeError =
          error && error.message ? error.message : "Unable to securely store passcode.";
        $rootScope.$applyAsync();
        return;
      }
      vm.passcode.value = "";
      vm.passcode.confirm = "";
      refreshStatus();
      vm.passcodeStatus = "Passcode set successfully.";
      $rootScope.$applyAsync();
      $window.setTimeout(() => {
        $rootScope.$applyAsync(() => {
          $location.path("/home");
        });
      }, 800);
    };

    vm.toggleBiometrics = async function () {
      vm.biometricError = "";
      if (vm.useBiometrics) {
        if (!SecurityService.isPasscodeSet()) {
          vm.biometricError = "Set a passcode before enabling biometrics.";
          vm.useBiometrics = false;
          $rootScope.$applyAsync();
          return;
        }
        try {
          await SecurityService.tryBiometricUnlock();
          await SecurityService.setBiometricsEnabled(true);
        } catch (error) {
          vm.biometricError = error && error.message ? error.message : "Biometrics failed.";
          vm.useBiometrics = false;
          await SecurityService.setBiometricsEnabled(false);
        }
        refreshStatus();
        $rootScope.$applyAsync();
        return;
      }
      await SecurityService.setBiometricsEnabled(false);
      refreshStatus();
      $rootScope.$applyAsync();
    };

    SecurityService.ensureReady().then(() => {
      refreshStatus();
      $rootScope.$applyAsync();
    });
  });
})();
