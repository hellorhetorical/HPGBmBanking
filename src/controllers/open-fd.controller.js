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

  angular.module("hpgbmbanking").controller("OpenFdController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Open Fixed Deposit";
      vm.subtitle = "Create a new fixed deposit in minutes.";
      const fdMaturityDefault = DEFAULT_FD_MATURITY_INSTRUCTIONS_DEFAULT;
      const fdMaturityTaxSaver = DEFAULT_FD_MATURITY_INSTRUCTIONS_TAX_SAVER;
      const fdInterestOptions = DEFAULT_FD_INTEREST_OPTIONS;
      const fdTaxSaverType = DEFAULT_FD_TYPE_TAX_SAVER;
      const autoCloseLabel = DEFAULT_FD_MATURITY_INSTRUCTION_AUTO_CLOSE;
      vm.accounts = MOCK_ACCOUNTS.filter((account) =>
        ["Savings", "Overdraft", "Term Deposit"].includes(account.type)
      );
      vm.fdTypes = DEFAULT_FD_TYPES;
      vm.fdRates = DEFAULT_FD_RATES;
      vm.partialWithdrawals = DEFAULT_FD_PARTIAL_WITHDRAWALS;
      vm.maturityInstructions = fdMaturityDefault;
      vm.nomineeOptions = DEFAULT_FD_NOMINEE_OPTIONS;
      vm.interestOptions = fdInterestOptions;
      vm.form = {
        fdType: getFirst(vm.fdTypes) || "",
        partialWithdrawal: getFirst(vm.partialWithdrawals) || "",
        maturityInstruction: getFirst(vm.maturityInstructions) || "",
        depositAmount: "",
        tenureYears: "0",
        tenureMonths: "0",
        tenureDays: "0",
        debitAccount: getFirst(vm.accounts),
        nomineeRetain: getFirst(vm.nomineeOptions) || "",
        interestOption: getFirst(vm.interestOptions) || "",
        transactionPassword: "",
      };
      vm.acceptedTerms = false;
      vm.step = "terms";
      vm.statusMessage = "";
      vm.balanceError = "";

      vm.viewTerms = function () {
        $location.path("/terms");
      };

      vm.clearBalanceError = function () {
        vm.balanceError = "";
      };

      vm.updateFdType = function () {
        if (fdTaxSaverType && vm.form.fdType === fdTaxSaverType) {
          vm.maturityInstructions = fdMaturityTaxSaver;
          vm.form.maturityInstruction = autoCloseLabel;
          vm.form.tenureYears = DEFAULT_FD_TAX_SAVER_TENURE_YEARS;
          vm.form.tenureMonths = DEFAULT_FD_TAX_SAVER_TENURE_MONTHS;
          vm.form.tenureDays = DEFAULT_FD_TAX_SAVER_TENURE_DAYS;
          if (!fdInterestOptions.includes(vm.form.interestOption)) {
            vm.form.interestOption = getFirst(fdInterestOptions) || "";
          }
          return;
        }
        vm.maturityInstructions = fdMaturityDefault;
        if (!vm.maturityInstructions.includes(vm.form.maturityInstruction)) {
          vm.form.maturityInstruction = getFirst(vm.maturityInstructions) || "";
        }
        vm.form.interestOption = "";
      };

      vm.getAccountLabel = function (account) {
        if (!account) {
          return "";
        }
        const balance = account.balance ? ` • ₹${account.balance}` : "";
        const maskedNumber = (window.HPGB_APP && window.HPGB_APP.maskAccountNumber)
          ? window.HPGB_APP.maskAccountNumber(account.number)
          : account.number;

        return `${maskedNumber} (${account.currency}) - ${account.holder.toUpperCase()}${balance}`;
      };

      vm.getMaturityAmount = function () {
        const amount = Number.parseFloat(
          (vm.form.depositAmount || "0").toString().replace(/,/g, "")
        );
        if (!Number.isFinite(amount)) {
          return "0.00";
        }
        const interestRate = vm.fdRates[vm.form.fdType] || 0;
        const maturity = amount + amount * (interestRate / 100);
        return maturity.toFixed(2);
      };

      vm.getInterestRateLabel = function () {
        const rate = vm.fdRates[vm.form.fdType];
        if (!rate) {
          return "Int. Rate: --";
        }
        return `Int. Rate: ${rate.toFixed(2)}`;
      };

      vm.continueFromTerms = function () {
        if (!vm.acceptedTerms) {
          return;
        }
        vm.updateFdType();
        vm.step = "form";
      };

      vm.continueFromForm = function () {
        const amount = Number.parseFloat((vm.form.depositAmount || "0").toString().replace(/,/g, ""));
        const balanceValue = Number.parseFloat(
          (vm.form.debitAccount && vm.form.debitAccount.balance
            ? vm.form.debitAccount.balance
            : "0"
          )
            .toString()
            .replace(/,/g, "")
        );
        const years = Number.parseInt(vm.form.tenureYears || "0", 10) || 0;
        const months = Number.parseInt(vm.form.tenureMonths || "0", 10) || 0;
        const days = Number.parseInt(vm.form.tenureDays || "0", 10) || 0;
        if (!Number.isFinite(amount) || amount <= 0) {
          vm.balanceError = "Enter a valid deposit amount.";
          return;
        }
        if (amount < 1000) {
          vm.balanceError = "Deposit amount must be at least 1,000.";
          return;
        }
        if (years === 0 && months === 0 && days === 0) {
          vm.balanceError = "Tenure cannot be 0 years, 0 months, and 0 days.";
          return;
        }
        if (Number.isFinite(balanceValue) && amount > balanceValue) {
          vm.balanceError = "Deposit amount exceeds available balance.";
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
