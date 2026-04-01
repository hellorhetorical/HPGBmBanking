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

  angular.module("hpgbmbanking").controller("OtpController", [
      "$location",
      "$rootScope",
      "$interval",
      "$scope",
      function ($location, $rootScope, $interval, $scope) {
        const vm = this;
        const params = $location.search();
        if (!params.userId) {
          $location.path("/");
          return;
        }
        vm.userId = params.userId;
        vm.otpDigits = ["", "", "", "", "", ""];
        vm.error = "";
        vm.timerSeconds = 60;
        vm.canResend = false;

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
          const isMatch = !USE_MOCK_LOGIN || enteredOtp === MOCK_LOGIN.otp;
          if (!isMatch) {
            vm.error = "We couldn't verify the OTP. Please check the code and try again.";
            return;
          }
          vm.error = "";
          MOCK_LOGIN.deviceId = MOCK_DEVICE_ID;
          $rootScope.bindResult = {
            status: "success",
            message: "Device binding successful. You can log in securely now.",
          };
          $location.path("/");
        };

        startTimer();

        vm.goBack = function () {
          $location.path("/");
        };

        $scope.$on("$destroy", () => {
          if (vm.timerPromise) {
            $interval.cancel(vm.timerPromise);
          }
        });
      },
    ]);
})();
