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
    MOCK_LIMIT_MAX,
    saveSession,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("LimitManagementController", [
      "$location",
      "$timeout",
      function ($location, $timeout) {
      const vm = this;
      vm.title = "Limit Management";
      vm.subtitle = "Update your overall transaction limit.";

      vm.existingLimit = "1,00,000.00";
      vm.maximumLimit = Number.isFinite(MOCK_LIMIT_MAX) ? MOCK_LIMIT_MAX : null;
      vm.step = "form";
      vm.formError = "";
      vm.form = {
        updatedLimit: "",
        otp: "",
        transactionPassword: "",
      };
      vm.isSuccess = true;
      vm.otpDigits = ["", "", "", "", "", ""];
      vm.timerSeconds = 30;
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

      const shortName = BANK_SHORT_NAME || "bankshortname";
      vm.revisedLimits = [
        { type: "Overall Limit", limit: "Rs. 5 Lakh" },
        { type: "IMPS Transaction", limit: "Rs. 5 Lakh" },
        { type: `Quick (Adhoc)Transfer within ${shortName} (without adding beneficiary)`, limit: "Rs. 10,000" },
        { type: "Within Bank transfer", limit: "Rs. 5 Lakh" },
        { type: "NEFT Transaction", limit: "Rs. 5 Lakh" },
        { type: "Fixed/Recurring Deposit", limit: "Rs. 1,99,99,999" },
        { type: "UPI Transaction", limit: "Rs. 1 Lakh" },
        { type: "Mobile/DTH Recharge", limit: "Rs. 50,000" },
        { type: "Bill Payments", limit: "Rs. 50,000" },
      ];

      vm.showLimits = function () {
        vm.step = "limits";
      };

      vm.backToForm = function () {
        vm.step = "form";
      };

      vm.continueToOtp = function () {
        vm.formError = "";
        if (!vm.form.updatedLimit) {
          vm.formError = "Enter updated limit amount.";
          return;
        }
        const amount = Number(String(vm.form.updatedLimit).replace(/,/g, ""));
        if (!Number.isFinite(amount) || amount <= 0) {
          vm.formError = "Enter a valid limit amount.";
          return;
        }
        if (vm.maximumLimit !== null && amount > vm.maximumLimit) {
          vm.formError = `Updated limit cannot exceed ${vm.maximumLimit}.`;
          return;
        }
        vm.step = "otp";
        vm.startTimer();
      };

      vm.startTimer = function () {
        vm.timerSeconds = 30;
        vm.canResend = false;
        const tick = function () {
          if (vm.timerSeconds <= 0) {
            vm.canResend = true;
            return;
          }
          vm.timerSeconds -= 1;
          $timeout(tick, 1000);
        };
        $timeout(tick, 1000);
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

      vm.regenerateOtp = function () {
        vm.otpDigits = ["", "", "", "", "", ""];
        vm.startTimer();
      };

      vm.continueToAuthorize = function () {
        vm.formError = "";
        const otp = vm.otpDigits.join("");
        if (!/^\d{6}$/.test(otp)) {
          vm.formError = "Enter 6-digit OTP.";
          return;
        }
        vm.form.otp = otp;
        vm.step = "authorize";
      };

      vm.submit = function () {
        vm.formError = "";
        const password = (vm.form.transactionPassword || "").trim();
        if (!password) {
          vm.formError = "TPIN is required.";
          return;
        }
        const ok = isMockTransactionPasswordValid(password);
        if (!ok) {
          vm.formError = "TPIN is incorrect.";
          return;
        }
        vm.step = "success";
      };

      vm.newRequest = function () {
        vm.step = "form";
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
    ]);
})();
