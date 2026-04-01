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
    saveSession,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("BeneficiaryAddController", [
      "$location",
      "$rootScope",
      function ($location, $rootScope) {
        const vm = this;
        const type = $location.search().type || "same";
        vm.title = "Add New Payee";
        const shortName = BANK_SHORT_NAME || "bankshortname";
        vm.subtitle = type === "other"
          ? "Add a beneficiary in another bank."
          : `Add a beneficiary within ${shortName}.`;
        vm.isOtherBank = type === "other";
        vm.form = {
          name: "",
          nickname: "",
          accountNumber: "",
          confirmAccountNumber: "",
          transactionType: "",
          ifsc: "",
        };
        vm.error = "";

        vm.submit = function () {
          vm.error = "";
          if (
            !vm.form.name ||
            !vm.form.nickname ||
            !vm.form.accountNumber ||
            !vm.form.confirmAccountNumber ||
            (vm.isOtherBank && (!vm.form.transactionType || !vm.form.ifsc))
          ) {
            vm.error = "Please fill all mandatory fields.";
            return;
          }
          if (vm.form.accountNumber !== vm.form.confirmAccountNumber) {
            vm.error = "Account numbers do not match.";
            return;
          }
          $rootScope.pendingPayee = {
            name: vm.form.name,
            nickname: vm.form.nickname,
            accountNumber: vm.form.accountNumber,
            transactionType: vm.form.transactionType,
            ifsc: vm.form.ifsc,
            type,
          };
          $location.path("/beneficiaries/confirm");
        };
      },
    ]);
})();
