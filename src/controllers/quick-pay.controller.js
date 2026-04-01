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

  angular.module("hpgbmbanking").controller("QuickPayController", [
      "$location",
      "$rootScope",
      function ($location, $rootScope) {
        const vm = this;
        const defaultUser = DEFAULT_USER;
        vm.title = "Quick Pay";
        vm.subtitle = "Send money instantly with minimal details.";
        vm.accounts = getMockList(MOCK_DATA.QUICK_PAY_ACCOUNTS);
        vm.fromAccounts = vm.accounts.filter((account) =>
          ["Savings", "Current", "Overdraft"].includes(account.type)
        );
      const firstFromAccount = getFirst(vm.fromAccounts);
      vm.form = {
        fromAccount: firstFromAccount ? firstFromAccount.number : null,
        toAccount: "",
        confirmToAccount: "",
        amount: "",
        transactionPassword: "",
      };
        vm.error = "";
        vm.passwordError = "";
        vm.showAuthorize = false;
        vm.showValidation = false;
        vm.fieldErrors = {};

        const isEmpty = function (value) {
          return value === null || value === undefined || value === "";
        };

        const parseBalance = function (value) {
          const numeric = Number((value || "").toString().replace(/,/g, ""));
          return Number.isNaN(numeric) ? 0 : numeric;
        };

        vm.getBalance = function (accountNumber) {
          const match = vm.fromAccounts.find((account) => account.number === accountNumber);
          return match ? match.balance : "--";
        };

        vm.clearFieldError = function (field) {
          if (vm.fieldErrors && vm.fieldErrors[field]) {
            delete vm.fieldErrors[field];
          }
        };

        vm.submit = function () {
          vm.error = "";
          vm.showValidation = true;
          vm.fieldErrors = {};
          if (isEmpty(vm.form.fromAccount) || isEmpty(vm.form.toAccount) || isEmpty(vm.form.confirmToAccount) || isEmpty(vm.form.amount)) {
            vm.error = "Please fill all mandatory fields.";
            return;
          }
          if (vm.form.toAccount !== vm.form.confirmToAccount) {
            vm.fieldErrors.confirmToAccount = "Account numbers do not match.";
            return;
          }
          const amountValue = Number(vm.form.amount);
          const balanceValue = parseBalance(vm.getBalance(vm.form.fromAccount));
          if (!Number.isFinite(amountValue) || amountValue <= 0) {
            vm.fieldErrors.amount = "Enter an amount greater than zero.";
            return;
          }
          if (amountValue > balanceValue) {
            vm.fieldErrors.amount = "Amount exceeds available balance.";
            return;
          }
          vm.showAuthorize = true;
        };

        vm.confirmAuthorization = function () {
          vm.passwordError = "";
          vm.error = "";
          const password = vm.form.transactionPassword;
          if (!password) {
            vm.passwordError = "Please enter the TPIN.";
            return;
          }
          if (USE_MOCK_LOGIN && password !== MOCK_LOGIN.transactionPassword) {
            vm.passwordError = "Invalid TPIN.";
            return;
          }
          const now = new Date();
          const accountName = defaultUser.name || defaultUser.userId || "";
          $rootScope.quickPayDraft = {
            from: accountName
              ? `${vm.form.fromAccount} (INR) - ${accountName}`
              : `${vm.form.fromAccount} (INR)`,
            to: vm.form.toAccount,
            amount: Number(vm.form.amount).toFixed(2),
            date: now.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          };
          $location.path("/quickpay-otp");
        };
      },
    ]);
})();
