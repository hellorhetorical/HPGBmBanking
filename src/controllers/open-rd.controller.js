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

  angular.module("hpgbmbanking").controller("OpenRdController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Open Recurring Deposit";
      vm.subtitle = "Start a recurring deposit with flexible tenure.";
      vm.accounts = MOCK_ACCOUNTS.filter((account) =>
        ["Savings", "Overdraft", "Current"].includes(account.type)
      );
      vm.nomineeOptions = DEFAULT_RD_NOMINEE_OPTIONS;
      vm.scheduleOptions = DEFAULT_RD_SCHEDULE_OPTIONS;
      vm.paymentDates = DEFAULT_RD_PAYMENT_DATES;
      const formatDate = function (date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      vm.form = {
        amount: "",
        years: "1",
        months: "0",
        openingDate: formatDate(new Date()),
        debitAccount: getFirst(vm.accounts),
        nomineeRetain: getFirst(vm.nomineeOptions) || "",
        scheduleInstallments: getFirst(vm.scheduleOptions) || "",
        paymentDate: getFirst(vm.paymentDates) || "",
        transactionPassword: "",
      };
      vm.acceptedTerms = false;
      vm.step = "terms";
      vm.statusMessage = "";
      vm.balanceError = "";

      vm.clearBalanceError = function () {
        vm.balanceError = "";
      };

      vm.viewTerms = function () {
        $location.path("/terms");
      };

      vm.getAccountLabel = function (account) {
        if (!account) {
          return "";
        }
        const maskedNumber = (window.HPGB_APP && window.HPGB_APP.maskAccountNumber)
          ? window.HPGB_APP.maskAccountNumber(account.number)
          : account.number;

        return `${maskedNumber} (${account.currency}) - ${account.holder.toUpperCase()}`;
      };

      vm.getInterestRateLabel = function () {
        return DEFAULT_RD_INTEREST_RATE_LABEL;
      };

      vm.getMaturityAmount = function () {
        const amount = Number.parseFloat((vm.form.amount || "0").toString().replace(/,/g, ""));
        if (!Number.isFinite(amount)) {
          return "0.00";
        }
        const months = (Number.parseInt(vm.form.years || "0", 10) || 0) * 12 +
          (Number.parseInt(vm.form.months || "0", 10) || 0);
        const maturity = amount * months * 1.45;
        return maturity.toFixed(2);
      };

      vm.continueFromTerms = function () {
        if (!vm.acceptedTerms) {
          return;
        }
        vm.step = "form";
      };

      vm.continueFromForm = function () {
        const amount = Number.parseFloat((vm.form.amount || "0").toString().replace(/,/g, ""));
        const years = Number.parseInt(vm.form.years || "0", 10) || 0;
        const months = Number.parseInt(vm.form.months || "0", 10) || 0;
        const totalMonths = years * 12 + months;
        if (!Number.isFinite(amount) || amount <= 0) {
          vm.balanceError = "Enter a valid deposit amount.";
          return;
        }
        if (amount < 500) {
          vm.balanceError = "Deposit amount must be at least 500.";
          return;
        }
        if (totalMonths < 6) {
          vm.balanceError = "Minimum period is 6 months.";
          return;
        }
        if (totalMonths > 120) {
          vm.balanceError = "Maximum period is 10 years.";
          return;
        }
        vm.balanceError = "";
        vm.step = "confirm";
      };

      vm.authorize = function () {
        const password = (vm.form.transactionPassword || "").trim();
        const isMatch = isMockTransactionPasswordValid(password);
        if (!isMatch) {
          vm.statusMessage = "TPIN is incorrect.";
          return;
        }
        vm.statusMessage = "";
        vm.step = "success";
      };

      vm.goHome = function () {
        $location.path("/home");
      };
    },
    ]);
})();
