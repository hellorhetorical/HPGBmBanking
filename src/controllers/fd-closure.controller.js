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

  angular.module("hpgbmbanking").controller("FdClosureController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "FD Closure";
      vm.subtitle = "Close your fixed deposit securely.";
      const closureBaseRate = Number(DEFAULT_FD_CLOSURE_BASE_RATE || 0);
      const formatAmount = function (value) {
        const amount = Number.parseFloat((value || "0").toString().replace(/,/g, ""));
        if (!Number.isFinite(amount)) {
          return "0.00";
        }
        return amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };
      const addDays = function (days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
      vm.fdAccounts = MOCK_ACCOUNTS.filter((account) => account.type === "Term Deposit").map(
        function (account, index) {
          const baseAmount = Number.parseFloat((account.balance || "0").toString().replace(/,/g, ""));
          const interestRate = closureBaseRate + index * 0.2;
          const maturityAmount = baseAmount + baseAmount * (interestRate / 100);
          const closureAmount = baseAmount + baseAmount * ((interestRate - 1) / 100);
          return {
            number: account.number,
            currency: account.currency || "INR",
            holder: account.holder,
            originalAmount: formatAmount(baseAmount),
            maturityDate: addDays(365 + index * 30),
            maturityAmount: formatAmount(maturityAmount),
            interestRate: interestRate.toFixed(2),
            closureAmount: formatAmount(closureAmount),
            applicableRate: (interestRate - 1).toFixed(2),
          };
        }
      );
      vm.creditAccounts = MOCK_ACCOUNTS.filter((account) =>
        ["Savings", "Overdraft", "Current"].includes(account.type)
      );
      const firstFdAccount = getFirst(vm.fdAccounts);
      const firstCreditAccount = getFirst(vm.creditAccounts);
      vm.form = {
        fdAccount: firstFdAccount,
        creditAccount: firstCreditAccount,
        holderName: firstFdAccount ? firstFdAccount.holder : "",
        transactionPassword: "",
      };
      vm.step = "form";
      vm.statusMessage = "";

      vm.getFdAccountLabel = function (account) {
        if (!account) {
          return "";
        }
        const maskedNumber = (window.HPGB_APP && window.HPGB_APP.maskAccountNumber)
          ? window.HPGB_APP.maskAccountNumber(account.number)
          : account.number;

        return `${maskedNumber} - ${account.currency} - ${account.holder.toUpperCase()}`;
      };

      vm.getCreditAccountLabel = function (account) {
        if (!account) {
          return "";
        }
        const maskedNumber = (window.HPGB_APP && window.HPGB_APP.maskAccountNumber)
          ? window.HPGB_APP.maskAccountNumber(account.number)
          : account.number;

        return `${maskedNumber} (${account.currency}) - ${account.holder.toUpperCase()}`;
      };

      vm.updateFdAccount = function () {
        if (!vm.form.fdAccount) {
          return;
        }
        vm.form.holderName = vm.form.fdAccount.holder;
      };

      vm.continueFromForm = function () {
        if (!vm.form.fdAccount || !vm.form.creditAccount) {
          return;
        }
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
