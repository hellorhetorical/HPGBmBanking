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

  angular.module("hpgbmbanking").controller("MiniStatementController", [
      "AccountContextService",
      function (AccountContextService) {
      const vm = this;
      vm.title = "Mini Statement";
      vm.subtitle = "Recent account activity";
      const accounts = getMockList(MOCK_DATA.MINI_STATEMENT_ACCOUNTS);
      const accountNumber = AccountContextService.getSelectedAccountNumber();
      AccountContextService.clearSelectedAccountNumber();
      vm.account =
        accounts.find((account) => account.number === accountNumber) || getFirst(accounts) || {};
      const statementByType = getMockObject(MOCK_DATA.MINI_STATEMENT_BY_TYPE, {
        savings: [],
      });
      const typeLabel = (vm.account.type || "").toLowerCase();
      const typeMap = DEFAULT_MINI_STATEMENT_TYPE_MAP;
      const matchedType = typeMap.find((entry) => typeLabel.includes(entry.match));
      const typeKey = matchedType
        ? matchedType.key
        : DEFAULT_MINI_STATEMENT_DEFAULT_TYPE;
      const statementEntries = statementByType[typeKey] || statementByType.savings || [];
      vm.statement = statementEntries.map((entry) => {
        const dateParts = (entry.date || "").split("/");
        const sortDate =
          dateParts.length === 3
            ? new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`).getTime()
            : 0;
        return { ...entry, sortDate };
      });
      vm.statement.sort((a, b) => b.sortDate - a.sortDate);

      vm.maskAccount = function (number) {
        const digits = (number || "").toString().replace(/\D/g, "");
        const last4 = digits.slice(-4);
        return `XXXXXXXXXXXX${last4}`;
      };
    },
    ]);
})();
