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

  angular.module("hpgbmbanking").controller("InitiateTransferController", [
      "$location",
      "$rootScope",
      function ($location, $rootScope) {
        const vm = this;
        const flowType = $location.search().type || "own";
        vm.flowLabel = flowType === "beneficiary" ? "Send to Beneficiary" : "Own Accounts";
        vm.title = "Make A Transfer";
        vm.subtitle = vm.flowLabel;
        vm.transactionTypes = DEFAULT_TRANSFER_TRANSACTION_TYPES;
        vm.accounts = getMockList(MOCK_DATA.TRANSFER_ACCOUNTS);
        vm.fromAccounts = vm.accounts.filter((account) =>
          ["Savings", "Current", "Overdraft"].includes(account.type)
        );
        vm.beneficiaries =
          flowType === "beneficiary"
            ? getMockList(MOCK_DATA.TRANSFER_BENEFICIARIES)
            : vm.accounts.map((account) => ({
                label: `${account.number} - ${account.name}`,
                value: account.number,
              }));

        const firstAccount = getFirst(vm.accounts);
        vm.form = {
          transactionType: flowType === "beneficiary" ? "IMPS" : "Self",
          fromAccount: firstAccount ? firstAccount.number : null,
          toAccount: null,
          currency: "INR",
          amount: "",
          paymentOption: "Pay",
          scheduleDate: "",
          remarks: "",
          transactionPassword: "",
          otp: "",
        };

        vm.error = "";
        vm.passwordError = "";
        vm.showOtp = false;
        vm.canSubmit = false;
        vm.showAuthorize = false;
        vm.showValidation = false;
        vm.fieldErrors = {};
        vm.clearFieldError = function (field) {
          if (vm.fieldErrors && vm.fieldErrors[field]) {
            delete vm.fieldErrors[field];
          }
        };

        vm.setTransactionType = function (value) {
          vm.form.transactionType = value;
        };

        vm.getBalance = function (accountNumber) {
          const match = vm.accounts.find((account) => account.number === accountNumber);
          return match ? match.balance : "--";
        };

        const parseBalance = function (value) {
          const numeric = Number((value || "").toString().replace(/,/g, ""));
          return Number.isNaN(numeric) ? 0 : numeric;
        };

        const isValidRemarks = function (value) {
          return /^[A-Za-z0-9\s.-]+$/.test((value || "").toString());
        };

        vm.confirmAuthorization = function () {
          vm.passwordError = "";
          vm.error = "";
          vm.showValidation = true;
          vm.fieldErrors = {};
          const password = vm.form.transactionPassword;
          if (!password) {
            vm.passwordError = "Please enter the TPIN.";
            vm.showOtp = false;
            vm.canSubmit = false;
            return;
          }
          if (USE_MOCK_LOGIN && password !== MOCK_LOGIN.transactionPassword) {
            vm.passwordError = "Invalid TPIN.";
            vm.showOtp = false;
            vm.canSubmit = false;
            return;
          }
          vm.showOtp = false;
          vm.canSubmit = false;
          $rootScope.transferDraft = {
            transactionType: vm.form.transactionType,
            fromAccount: vm.form.fromAccount,
            toAccount: vm.form.toAccount,
            amount: vm.form.amount,
            paymentOption: vm.form.paymentOption,
            scheduleDate: vm.form.scheduleDate,
            remarks: vm.form.remarks,
            flowType,
          };
          $location.path("/transfer-otp");
          $rootScope.$applyAsync();
        };

        const isEmpty = function (value) {
          return value === null || value === undefined || value === "";
        };

        vm.submit = function () {
          vm.error = "";
          vm.showValidation = true;
          vm.fieldErrors = {};
          const baseFieldsMissing =
            isEmpty(vm.form.transactionType) ||
            isEmpty(vm.form.fromAccount) ||
            isEmpty(vm.form.toAccount) ||
            isEmpty(vm.form.amount) ||
            isEmpty(vm.form.paymentOption) ||
            (vm.form.paymentOption === "Schedule" && isEmpty(vm.form.scheduleDate)) ||
            isEmpty(vm.form.remarks);

          const amountValue = Number(vm.form.amount);
          const balanceValue = parseBalance(vm.getBalance(vm.form.fromAccount));
          if (!Number.isFinite(amountValue) || amountValue <= 0) {
            vm.fieldErrors.amount = "Enter an amount greater than zero.";
          } else if (amountValue > balanceValue) {
            vm.fieldErrors.amount = "Amount exceeds available balance.";
          }

          if (vm.form.paymentOption === "Schedule" && vm.form.scheduleDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const scheduled = new Date(vm.form.scheduleDate);
            if (Number.isNaN(scheduled.getTime()) || scheduled < today) {
              vm.fieldErrors.scheduleDate = "Select a future date.";
            }
          }

          if (vm.form.remarks && !isValidRemarks(vm.form.remarks)) {
            vm.fieldErrors.remarks = "Special characters are not allowed.";
          }

          if (baseFieldsMissing) {
            vm.error = "Please fill all mandatory fields.";
            return;
          }

          if (Object.keys(vm.fieldErrors).length) {
            return;
          }

          if (
            !vm.showAuthorize
          ) {
            vm.showAuthorize = true;
            return;
          }

          if (isEmpty(vm.form.transactionPassword)) {
            vm.error = "Please fill all mandatory fields.";
            return;
          }

          if (!vm.showOtp || !vm.canSubmit) {
            vm.error = "Please confirm your TPIN to proceed.";
            return;
          }

          if (isEmpty(vm.form.otp)) {
            vm.error = "Please enter the OTP.";
            return;
          }

          $location.path("/transfer-otp");
        };
      },
    ]);
})();
