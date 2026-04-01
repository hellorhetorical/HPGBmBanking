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

  angular.module("hpgbmbanking").controller("ForgotCardController", [
      "$location",
      function ($location) {
        const vm = this;
        const params = $location.search();
        if (!params.userId || !params.flow) {
          $location.path("/");
          return;
        }
        vm.flow = params.flow;
        vm.userId = params.userId;
        vm.form = {
          cardNumber: "",
          holderName: "",
          expiry: "",
          cvv: "",
        };
        vm.error = "";

        vm.goBack = function () {
          window.history.back();
        };

        vm.verifyCard = function () {
          if (
            !vm.form.cardNumber ||
            !vm.form.holderName ||
            !vm.form.expiry ||
            !vm.form.cvv
          ) {
            vm.error = "Please enter all debit card details.";
            return;
          }
          if (USE_MOCK_LOGIN) {
            const normalizedNumber = vm.form.cardNumber.replace(/\s+/g, "");
            const normalizedExpiry = vm.form.expiry.trim();
            const normalizedCvv = vm.form.cvv.trim();
            if (
              normalizedNumber !== MOCK_LOGIN.debitCard.number ||
              normalizedExpiry !== MOCK_LOGIN.debitCard.expiry ||
              normalizedCvv !== MOCK_LOGIN.debitCard.cvv
            ) {
              vm.error = "Debit card details do not match. Please check and try again.";
              return;
            }
          }
          vm.error = "";
          $location.path("/forgot-reset").search({
            flow: vm.flow,
            userId: vm.userId,
          });
        };
      },
    ]);
})();
