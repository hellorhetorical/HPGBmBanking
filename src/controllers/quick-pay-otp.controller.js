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

  angular.module("hpgbmbanking").controller("QuickPayOtpController", [
      "$location",
      "$rootScope",
      "$interval",
      "$scope",
      function ($location, $rootScope, $interval, $scope) {
        const vm = this;
        const draft = $rootScope.quickPayDraft;
        if (!draft) {
          $location.path("/quickpay");
          return;
        }
        vm.summary = draft;
        vm.otpDigits = ["", "", "", "", "", ""];
        vm.error = "";
        vm.timerSeconds = 60;
        vm.canResend = false;
        vm.activeOtpIndex = 0;

        const getOtpInputs = function (target) {
          if (target && typeof target.closest === "function") {
            const group = target.closest(".binddevice-otp-inputs");
            if (group) {
              return group.querySelectorAll(".binddevice-otp-input");
            }
          }
          return document.querySelectorAll(".binddevice-otp-inputs .binddevice-otp-input");
        };

        const focusOtpInput = function (index, inputs) {
          if (!inputs || !inputs.length) {
            return;
          }
          const next = inputs[index];
          if (next) {
            next.focus();
          }
        };

        vm.setOtpIndex = function (index) {
          vm.activeOtpIndex = index;
        };

        vm.onOtpKeyup = function (index, $event) {
          const inputs = getOtpInputs($event.target);
          if (!inputs.length) {
            return;
          }
          const key = $event.key;
          const target = $event.target;

          if (key === "Backspace" && !target.value && index > 0) {
            focusOtpInput(index - 1, inputs);
            return;
          }

          if (target.value && index < inputs.length - 1) {
            focusOtpInput(index + 1, inputs);
          }
        };

        vm.handleOtpInput = function (digit) {
          if (!/^\d$/.test(digit)) {
            return;
          }
          const inputs = getOtpInputs();
          if (!inputs.length) {
            return;
          }
          const index = Math.min(vm.activeOtpIndex, inputs.length - 1);
          vm.otpDigits[index] = digit;
          if (index < inputs.length - 1) {
            vm.activeOtpIndex = index + 1;
            focusOtpInput(index + 1, inputs);
          } else {
            focusOtpInput(index, inputs);
          }
        };

        vm.handleOtpBackspace = function () {
          const inputs = getOtpInputs();
          if (!inputs.length) {
            return;
          }
          let index = vm.activeOtpIndex;
          if (vm.otpDigits[index]) {
            vm.otpDigits[index] = "";
            focusOtpInput(index, inputs);
            return;
          }
          if (index > 0) {
            index -= 1;
            vm.otpDigits[index] = "";
            vm.activeOtpIndex = index;
            focusOtpInput(index, inputs);
          }
        };

        const startTimer = function () {
          vm.timerSeconds = 60;
          vm.canResend = false;
          if (vm.timerPromise) {
            $interval.cancel(vm.timerPromise);
          }
          vm.timerPromise = $interval(() => {
            vm.timerSeconds -= 1;
            if (vm.timerSeconds <= 0) {
              vm.timerSeconds = 0;
              vm.canResend = true;
              $interval.cancel(vm.timerPromise);
              vm.timerPromise = null;
            }
          }, 1000);
        };

        vm.resendOtp = function () {
          vm.otpDigits = ["", "", "", "", "", ""];
          vm.error = "";
          startTimer();
        };

        vm.verify = function () {
          const enteredOtp = vm.otpDigits.join("").trim();
          if (vm.otpDigits.some((digit) => !digit)) {
            vm.error = "Please enter the complete OTP.";
            return;
          }
          const success = !USE_MOCK_LOGIN || enteredOtp === MOCK_LOGIN.otp;
          $rootScope.quickPayStatus = {
            ...vm.summary,
            reference: Math.floor(100000 + Math.random() * 900000).toString(),
            status: success ? "success" : "failure",
          };
          $location.path("/quickpay-status");
        };

        startTimer();

        $scope.$on("$destroy", () => {
          if (vm.timerPromise) {
            $interval.cancel(vm.timerPromise);
          }
        });
      },
    ]);
})();
