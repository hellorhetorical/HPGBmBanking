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

  angular.module("hpgbmbanking").controller("EmiMoratoriumController", function () {
      const vm = this;
      vm.title = "EMI Calculator (Moratorium)";
      vm.subtitle = "Estimate EMI with a moratorium period.";
      vm.form = {
        date: "",
        amount: "",
        months: "",
        rate: "",
        moratorium: "",
        extra: "0",
      };
      vm.result = null;

      vm.calculate = function () {
        const principal = parseFloat(vm.form.amount);
        const totalMonths = parseInt(vm.form.months, 10);
        const rateAnnual = parseFloat(vm.form.rate);
        const moratoriumMonths = parseInt(vm.form.moratorium, 10);
        const extra = parseFloat(vm.form.extra || 0);

        if (
          !principal ||
          !totalMonths ||
          !rateAnnual ||
          totalMonths <= 0 ||
          isNaN(moratoriumMonths) ||
          moratoriumMonths < 0 ||
          moratoriumMonths >= totalMonths
        ) {
          vm.result = null;
          return;
        }

        const monthlyRate = rateAnnual / 1200;
        const remainingMonths = totalMonths - moratoriumMonths;
        const principalAfterMoratorium =
          monthlyRate === 0
            ? principal
            : principal * Math.pow(1 + monthlyRate, moratoriumMonths);
        const baseEmi =
          monthlyRate === 0
            ? principalAfterMoratorium / remainingMonths
            : (principalAfterMoratorium *
                monthlyRate *
                Math.pow(1 + monthlyRate, remainingMonths)) /
              (Math.pow(1 + monthlyRate, remainingMonths) - 1);
        const adjustedEmi = baseEmi + (isNaN(extra) ? 0 : extra);
        const totalPayment = baseEmi * remainingMonths;
        const totalInterest = totalPayment - principal;
        const loanDate = vm.form.date ? new Date(vm.form.date) : null;
        const formattedDate = loanDate && !isNaN(loanDate.getTime()) ? loanDate.toDateString() : "—";

        vm.result = {
          principalAfterMoratorium,
          remainingMonths,
          baseEmi,
          adjustedEmi,
          totalPayment,
          totalInterest,
          formattedDate,
        };
      };

      vm.reset = function () {
        vm.form = {
          date: "",
          amount: "",
          months: "",
          rate: "",
          moratorium: "",
          extra: "0",
        };
        vm.result = null;
      };
    });
})();
