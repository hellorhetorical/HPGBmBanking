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

  angular.module("hpgbmbanking").controller("TrackRdStatusController", [
      function () {
      const vm = this;
      vm.title = "Track RD Status";
      vm.subtitle = "Search and review your RD requests.";
      vm.search = {
        fromDate: "",
        toDate: "",
      };
      vm.showResults = false;
      vm.filteredItems = [];
      const formatAmount = function (value) {
        const amount = Number.parseFloat((value || "0").toString().replace(/,/g, ""));
        if (!Number.isFinite(amount)) {
          return "0.00";
        }
        return amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };
      const formatDate = function (date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };
      const formatDisplayDate = function (date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      const rdAccounts = MOCK_RD_ACCOUNTS;
      vm.statusItems = rdAccounts.map(function (account, index) {
        const date = new Date();
        date.setDate(date.getDate() - (index + 1) * 15);
        const months = account.tenureMonths || 12;
        const installment = Number.parseFloat(
          (account.installment || "0").toString().replace(/,/g, "")
        );
        return {
          id: `RD-${account.number.slice(-4)}-${index + 1}`,
          date: formatDate(date),
          status: index % 2 === 0 ? "Active" : "Pending",
          color: index % 2 === 0 ? "success" : "warning",
          source: account,
          openDate: formatDisplayDate(date),
          tenureMonths: months,
          installmentAmount: installment,
          maturityAmount: installment * months * 1.18,
        };
      });
      vm.detail = { ...DEFAULT_RD_STATUS_DETAIL };

      const updateDetail = function (item) {
        if (!item) {
          return;
        }
        const account = item.source;
        const years = Math.floor(item.tenureMonths / 12);
        const months = item.tenureMonths % 12;
        vm.detail.transactionId = item.id;
        vm.detail.status = item.status;
        vm.detail.installmentAmount = formatAmount(item.installmentAmount);
        vm.detail.tenureYears = String(years);
        vm.detail.tenureMonths = String(months);
        vm.detail.openDate = item.openDate;
        vm.detail.customerName = (account.holder || "").toUpperCase();
        vm.detail.depositAccount = account.number;
        vm.detail.maturityAmount = formatAmount(
          account.maturityAmount || item.maturityAmount
        );
        vm.detail.maturityDate = formatDisplayDate(
          new Date(Date.now() + item.tenureMonths * 30 * 24 * 60 * 60 * 1000)
        );
        vm.detail.debitAccount = (account.number || "").replace("2", "0");
      };

      vm.searchStatus = function () {
        if (!vm.search.fromDate || !vm.search.toDate) {
          return;
        }
        const fromDate = new Date(vm.search.fromDate);
        const toDate = new Date(vm.search.toDate);
        vm.filteredItems = vm.statusItems.filter(function (item) {
          const itemDate = new Date(item.date);
          return itemDate >= fromDate && itemDate <= toDate;
        });
        vm.showResults = true;
        vm.selected = getFirst(vm.filteredItems);
        updateDetail(vm.selected);
      };

      vm.viewDetail = function (item) {
        vm.selected = item;
        updateDetail(vm.selected);
      };

      vm.resetSearch = function () {
        vm.search.fromDate = "";
        vm.search.toDate = "";
        vm.filteredItems = [];
        vm.showResults = false;
        vm.selected = null;
      };
    },
    ]);
})();
