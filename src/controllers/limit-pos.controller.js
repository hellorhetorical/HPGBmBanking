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

  angular.module("hpgbmbanking").controller("LimitPosController", [
      "$location",
      function ($location) {
      const vm = this;
      vm.title = "Update POS Limit";
      vm.subtitle = "Set a new POS spending limit.";
      vm.accounts = getMockList(MOCK_DATA.LIMIT_POS_ACCOUNTS);
      const mockCard = typeof MOCK_LOGIN !== "undefined" ? MOCK_LOGIN.debitCard : null;
      const mockCardNumber = mockCard && mockCard.number ? mockCard.number : DEFAULT_DEBIT_CARD_NUMBER;
      const mockExpiry = mockCard && mockCard.expiry ? mockCard.expiry : DEFAULT_DEBIT_CARD_EXPIRY;
      const expiryParts = mockExpiry.split("/");
      const expiryMonth = expiryParts[0] || "";
      const expiryYear = expiryParts[1] || "";
      const limitCards = getMockObject(MOCK_DATA.LIMIT_CARDS_BY_ACCOUNT);
      vm.cardsByAccount =
        Object.keys(limitCards).length > 0
          ? limitCards
          : {};
      vm.form = {
        account: getFirst(vm.accounts),
        card: "",
        expMonth: expiryMonth,
        expYear: expiryYear,
        cardPin: "",
        transactionPassword: "",
        posLimit: "",
      };
      vm.step = "note";
      vm.cardPinError = "";
      vm.statusMessage = "";
      vm.standardLimit = DEFAULT_LIMIT_STANDARD_LIMITS.pos || "";
      const standardLimitValue = Number.parseFloat(vm.standardLimit.replace(/,/g, ""));

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

      vm.continueFromNote = function () {
        vm.step = "auth";
      };

      vm.continueFromAuth = function () {
        if (!vm.form.cardPin) {
          vm.cardPinError = "Enter the card PIN to continue.";
          return;
        }
        if (vm.form.cardPin !== MOCK_CARD_PIN) {
          vm.cardPinError = "Card PIN is incorrect.";
          return;
        }
        vm.cardPinError = "";
        vm.step = "update";
      };

      vm.viewApplicableLimits = function () {
        vm.step = "applicable";
      };

      vm.backToUpdate = function () {
        vm.step = "update";
      };

      vm.continueFromUpdate = function () {
        if (!vm.form.posLimit) {
          vm.statusMessage = "Enter the new POS limit.";
          return;
        }
        const enteredLimit = Number.parseFloat(
          vm.form.posLimit.toString().replace(/,/g, "")
        );
        if (!Number.isFinite(enteredLimit)) {
          vm.statusMessage = "Enter a valid POS limit.";
          return;
        }
        if (enteredLimit < 0) {
          vm.statusMessage = "POS limit cannot be below 0.";
          return;
        }
        if (standardLimitValue && enteredLimit > standardLimitValue) {
          vm.statusMessage = "POS limit cannot exceed the standard limit.";
          return;
        }
        vm.statusMessage = "";
        vm.step = "authorize";
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

      vm.updateCards();
    },
    ]);
})();
