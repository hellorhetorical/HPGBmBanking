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

  angular.module("hpgbmbanking").controller("HostlistDebitCardController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Hostlist Debit Card";
      vm.subtitle = "Block your debit card if it is lost or stolen.";
      vm.accounts = getMockList(MOCK_DATA.HOTLIST_ACCOUNTS);
      vm.cardsByAccount = getMockObject(MOCK_DATA.HOTLIST_CARDS_BY_ACCOUNT);
      vm.form = {
        account: getFirst(vm.accounts),
        card: "",
        transactionPassword: "",
      };
      vm.showConfirm = false;
      vm.result = null;
      vm.statusMessage = "";

      vm.getAccountLabel = function (account) {
        if (!account) {
          return "";
        }
        const maskedNumber = (window.HPGB_APP && window.HPGB_APP.maskAccountNumber)
          ? window.HPGB_APP.maskAccountNumber(account.number)
          : account.number;

        return `${maskedNumber} (${account.currency}) - ${account.type.toUpperCase()}`;
      };

      vm.getCardsForAccount = function (account) {
        if (!account) {
          return [];
        }
        return vm.cardsByAccount[account.number] || [];
      };

      vm.updateCards = function () {
        const cards = vm.getCardsForAccount(vm.form.account);
        vm.form.card = cards[0] || "";
      };

      vm.continue = function () {
        vm.showConfirm = true;
      };

      vm.confirm = function () {
        const password = (vm.form.transactionPassword || "").trim();
        const isSuccess = isMockTransactionPasswordValid(password);
        vm.result = {
          success: isSuccess,
          timestamp: new Date().toLocaleString("en-IN"),
        };
        vm.statusMessage = isSuccess
          ? "Your debit card has been hotlisted successfully."
          : "We could not verify your TPIN. Please try again.";
      };

      vm.updateCards();

      vm.reset = function () {
        vm.form.transactionPassword = "";
        vm.showConfirm = false;
        vm.result = null;
        vm.statusMessage = "";
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
    ]);
})();
