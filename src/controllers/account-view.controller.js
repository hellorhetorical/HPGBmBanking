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

  angular.module("hpgbmbanking").controller("AccountViewController", [
      "$location",
      "AccountContextService",
      function ($location, AccountContextService) {
      const vm = this;
      vm.title = "My Account";
      vm.tabs = DEFAULT_ACCOUNT_VIEW_TABS;
      vm.activeTab = "savings";
      const rawAccounts = getMockList(MOCK_DATA.ACCOUNT_VIEW_ACCOUNTS, MOCK_ACCOUNTS);
      const groupMap = {
        savings: "savings",
        current: "current",
        overdraft: "overdraft",
        "term deposit": "term-deposit",
        "fixed deposit": "term-deposit",
        loan: "loan",
      };

      vm.accounts = rawAccounts.map((account) => {
        if (account.group) {
          return account;
        }
        const key = (account.type || "").toString().trim().toLowerCase();
        return {
          ...account,
          group: groupMap[key] || "savings",
        };
      });

      vm.visibleTabs = vm.tabs.filter((tab) =>
        vm.accounts.some((account) => account.group === tab.value)
      );

      const updateActiveAccounts = function () {
        vm.activeAccounts = vm.accounts.filter((account) => account.group === vm.activeTab);
      };

      vm.setTab = function (value) {
        vm.activeTab = value;
        updateActiveAccounts();
      };

      vm.maskAccount = function (number) {
        const digits = (number || "").toString().replace(/\D/g, "");
        const last4 = digits.slice(-4);
        return `XXXXXXXXXXXX${last4}`;
      };

      vm.viewAccountDetails = function (account) {
        if (account && account.number) {
          AccountContextService.setSelectedAccountNumber(account.number);
        }
        $location.path("/account-details");
      };

      vm.viewMiniStatement = function (account) {
        if (account && account.number) {
          AccountContextService.setSelectedAccountNumber(account.number);
        }
        $location.path("/mini-statement");
      };

      updateActiveAccounts();
    },
    ]);
})();
