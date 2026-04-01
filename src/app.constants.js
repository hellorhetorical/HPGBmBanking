(() => {
  "use strict";

  const MOCK_DATA = window.MOCK_DATA || {};
  const MOCK_CONFIG = window.MOCK_CONFIG || {};
  const APP_CONFIG = window.HPGB_CONFIG || {};
  const DEMO_MODE = MOCK_CONFIG.DEMO_MODE !== undefined ? !!MOCK_CONFIG.DEMO_MODE : true;
  const USE_MOCK_DATA = !!MOCK_CONFIG.USE_MOCK_DATA;

  const getMockList = function (value, fallback = []) {
    if (!USE_MOCK_DATA) {
      return fallback;
    }
    return Array.isArray(value) ? value : fallback;
  };

  const getMockObject = function (value, fallback = {}) {
    if (!USE_MOCK_DATA) {
      return fallback;
    }
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  };

  const getFirst = function (list) {
    return Array.isArray(list) && list.length ? list[0] : null;
  };

  const getConfigList = function (value, fallback = []) {
    return Array.isArray(value) ? value : fallback;
  };

  const getConfigObject = function (value, fallback = {}) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
  };

  const getConfigValue = function (value, fallback = "") {
    return value === undefined || value === null ? fallback : value;
  };

  const maskAccountNumber = function (value) {
    const digits = (value || "").toString().replace(/\D/g, "");
    const last4 = digits.slice(-4);
    return last4 ? `XXXXXXXXXXXX${last4}` : "";
  };

  const DEFAULT_DEVICE_ID = getConfigValue(MOCK_CONFIG.DEVICE_ID, "");
  const DEFAULT_USER = getConfigObject(MOCK_CONFIG.DEFAULT_USER, { name: "", userId: "" });
  const DEFAULT_CARD_PIN = getConfigValue(MOCK_CONFIG.CARD_PIN, "");
  const DEFAULT_DEBIT_CARD_NUMBER = getConfigValue(MOCK_CONFIG.DEBIT_CARD_NUMBER, "");
  const DEFAULT_DEBIT_CARD_EXPIRY = getConfigValue(MOCK_CONFIG.DEBIT_CARD_EXPIRY, "");
  const DEFAULT_HOME_HIGHLIGHT_ACCOUNTS = getConfigList(MOCK_CONFIG.HOME_HIGHLIGHT_ACCOUNTS);
  const DEFAULT_HOME_SECTIONS = getConfigList(APP_CONFIG.HOME_SECTIONS);
  const DEFAULT_DEPOSIT_ACTIONS = getConfigList(APP_CONFIG.DEPOSIT_ACTIONS);
  const DEFAULT_TRANSFER_TRANSACTION_TYPES = getConfigList(APP_CONFIG.TRANSFER_TRANSACTION_TYPES);
  const DEFAULT_ACCOUNT_VIEW_TABS = getConfigList(APP_CONFIG.ACCOUNT_VIEW_TABS);
  const DEFAULT_LIMIT_MANAGEMENT_ITEMS = getConfigList(APP_CONFIG.LIMIT_MANAGEMENT_ITEMS);
  const DEFAULT_LIMIT_STANDARD_LIMITS = getConfigObject(APP_CONFIG.LIMIT_STANDARD_LIMITS);
  const DEFAULT_FD_TYPES = getConfigList(APP_CONFIG.FD_TYPES);
  const DEFAULT_FD_TYPE_TAX_SAVER = getConfigValue(APP_CONFIG.FD_TYPE_TAX_SAVER, "");
  const DEFAULT_FD_RATES = getConfigObject(APP_CONFIG.FD_RATES);
  const DEFAULT_FD_PARTIAL_WITHDRAWALS = getConfigList(APP_CONFIG.FD_PARTIAL_WITHDRAWALS);
  const DEFAULT_FD_MATURITY_INSTRUCTIONS_DEFAULT = getConfigList(
    APP_CONFIG.FD_MATURITY_INSTRUCTIONS_DEFAULT
  );
  const DEFAULT_FD_MATURITY_INSTRUCTIONS_TAX_SAVER = getConfigList(
    APP_CONFIG.FD_MATURITY_INSTRUCTIONS_TAX_SAVER
  );
  const DEFAULT_FD_MATURITY_INSTRUCTION_AUTO_CLOSE = getConfigValue(
    APP_CONFIG.FD_MATURITY_INSTRUCTION_AUTO_CLOSE,
    ""
  );
  const DEFAULT_FD_TAX_SAVER_TENURE_YEARS = getConfigValue(
    APP_CONFIG.FD_TAX_SAVER_TENURE_YEARS,
    ""
  );
  const DEFAULT_FD_TAX_SAVER_TENURE_MONTHS = getConfigValue(
    APP_CONFIG.FD_TAX_SAVER_TENURE_MONTHS,
    ""
  );
  const DEFAULT_FD_TAX_SAVER_TENURE_DAYS = getConfigValue(
    APP_CONFIG.FD_TAX_SAVER_TENURE_DAYS,
    ""
  );
  const DEFAULT_FD_NOMINEE_OPTIONS = getConfigList(APP_CONFIG.FD_NOMINEE_OPTIONS);
  const DEFAULT_FD_INTEREST_OPTIONS = getConfigList(APP_CONFIG.FD_INTEREST_OPTIONS);
  const DEFAULT_FD_CLOSURE_BASE_RATE = getConfigValue(APP_CONFIG.FD_CLOSURE_BASE_RATE, "");
  const DEFAULT_FD_STATUS_INTEREST_RATE = getConfigValue(APP_CONFIG.FD_STATUS_INTEREST_RATE, "");
  const DEFAULT_RD_NOMINEE_OPTIONS = getConfigList(APP_CONFIG.RD_NOMINEE_OPTIONS);
  const DEFAULT_RD_SCHEDULE_OPTIONS = getConfigList(APP_CONFIG.RD_SCHEDULE_OPTIONS);
  const DEFAULT_RD_PAYMENT_DATES = getConfigList(APP_CONFIG.RD_PAYMENT_DATES);
  const DEFAULT_RD_INTEREST_RATE_LABEL = getConfigValue(APP_CONFIG.RD_INTEREST_RATE_LABEL, "");
  const DEFAULT_FD_STATUS_DETAIL = getConfigObject(APP_CONFIG.FD_STATUS_DETAIL);
  const DEFAULT_RD_STATUS_DETAIL = getConfigObject(APP_CONFIG.RD_STATUS_DETAIL);
  const DEFAULT_MINI_STATEMENT_TYPE_MAP = getConfigList(APP_CONFIG.MINI_STATEMENT_TYPE_MAP);
  const DEFAULT_MINI_STATEMENT_DEFAULT_TYPE = getConfigValue(
    APP_CONFIG.MINI_STATEMENT_DEFAULT_TYPE,
    ""
  );
  const DEFAULT_COMPOUNDING_MAP = getConfigObject(APP_CONFIG.COMPOUNDING_MAP);
  const BANK_SHORT_NAME = getConfigValue(APP_CONFIG.BANK_SHORT_NAME, "bankshortname");
  const BANK_NAME = getConfigValue(APP_CONFIG.BANK_NAME, "bankname");
  const APP_NAME = getConfigValue(APP_CONFIG.APP_NAME, `${BANK_SHORT_NAME}mBanking`);
  const APP_NAME_SUP = getConfigValue(APP_CONFIG.APP_NAME_SUP, "Plus");
  const APP_VERSION = getConfigValue(MOCK_CONFIG.APP_VERSION, "1.0.0");
  const APP_TITLE = getConfigValue(APP_CONFIG.APP_TITLE, `${BANK_SHORT_NAME} mBanking`);
  const APP_SUBTITLE = getConfigValue(APP_CONFIG.APP_SUBTITLE, "Secure mobile access");
  const DEFAULT_TOLL_FREE = getConfigValue(APP_CONFIG.TOLL_FREE, "tollfree");
  const DEFAULT_SUPPORT_EMAIL = getConfigValue(APP_CONFIG.SUPPORT_EMAIL, "supportemail");
  const START_APPLICATION_URL = getConfigValue(APP_CONFIG.START_APPLICATION_URL, "");
  const PRIVACY_POLICY_URL = getConfigValue(APP_CONFIG.PRIVACY_POLICY_URL, "");
  const LOCATE_BRANCH_URL = getConfigValue(APP_CONFIG.LOCATE_BRANCH_URL, "");
  const WHATSAPP_BANKING_NUMBER = getConfigValue(APP_CONFIG.WHATSAPP_BANKING_NUMBER, "");
  const HOLIDAYS_LIST_URL = getConfigValue(APP_CONFIG.HOLIDAYS_LIST_URL, "");
  const TERMS_URL = getConfigValue(APP_CONFIG.TERMS_URL, "");
  const FORM_26AS_URL = getConfigValue(APP_CONFIG.FORM_26AS_URL, "");
  const BBPS_COMPLAINT_URL = getConfigValue(APP_CONFIG.BBPS_COMPLAINT_URL, "");
  const WHATSAPP_BASE_URL = getConfigValue(APP_CONFIG.WHATSAPP_BASE_URL, "");
  const SOCIAL_FACEBOOK_HANDLE = getConfigValue(APP_CONFIG.SOCIAL_FACEBOOK_HANDLE, "");
  const SOCIAL_X_HANDLE = getConfigValue(APP_CONFIG.SOCIAL_X_HANDLE, "");
  const SOCIAL_INSTAGRAM_HANDLE = getConfigValue(APP_CONFIG.SOCIAL_INSTAGRAM_HANDLE, "");
  const SOCIAL_YOUTUBE_HANDLE = getConfigValue(APP_CONFIG.SOCIAL_YOUTUBE_HANDLE, "");
  const SOCIAL_FACEBOOK_BASE_URL = getConfigValue(APP_CONFIG.SOCIAL_FACEBOOK_BASE_URL, "");
  const SOCIAL_X_BASE_URL = getConfigValue(APP_CONFIG.SOCIAL_X_BASE_URL, "");
  const SOCIAL_INSTAGRAM_BASE_URL = getConfigValue(APP_CONFIG.SOCIAL_INSTAGRAM_BASE_URL, "");
  const SOCIAL_YOUTUBE_BASE_URL = getConfigValue(APP_CONFIG.SOCIAL_YOUTUBE_BASE_URL, "");

  const CONFIG_LOGIN = USE_MOCK_DATA && DEMO_MODE
    ? {
        username: DEFAULT_USER.userId || "",
        password: getConfigValue(MOCK_CONFIG.LOGIN_PASSWORD, ""),
        transactionPassword: getConfigValue(MOCK_CONFIG.TRANSACTION_PASSWORD, ""),
      }
    : {};
  const MOCK_LOGIN = USE_MOCK_DATA && DEMO_MODE
    ? { ...CONFIG_LOGIN, ...getMockObject(MOCK_DATA.MOCK_LOGIN) }
    : {};
  const USE_MOCK_LOGIN =
    USE_MOCK_DATA && DEMO_MODE && !!(MOCK_LOGIN && (MOCK_LOGIN.username || MOCK_LOGIN.otp));
  const MOCK_CARD_PIN = DEFAULT_CARD_PIN;
  const MOCK_DEVICE_ID = DEFAULT_DEVICE_ID;
  const MOCK_ACCOUNTS = getMockList(MOCK_DATA.MOCK_ACCOUNTS);
  const MOCK_CHEQUE_STATUS = getMockObject(MOCK_DATA.MOCK_CHEQUE_STATUS);
  const MOCK_CHEQUE_UNUSED_RANGE = getMockObject(MOCK_DATA.MOCK_CHEQUE_UNUSED_RANGE);
  const MOCK_LIMIT_MAX = getConfigValue(MOCK_DATA.MOCK_LIMIT_MAX, null);
  const MOCK_RD_ACCOUNTS = getMockList(MOCK_DATA.MOCK_RD_ACCOUNTS);
  let memorySession = null;
  const SESSION_DURATION_MS = 15 * 60 * 1000;

  const isMockTransactionPasswordValid = function (password) {
    if (!USE_MOCK_LOGIN) {
      return true;
    }
    return password === (MOCK_LOGIN.transactionPassword || "");
  };


  const readSession = function () {
    try {
      if (!memorySession) {
        return null;
      }
      const session = { ...memorySession };
      if (!session || (session.expiresAt && Date.now() >= session.expiresAt)) {
        memorySession = null;
        return null;
      }
      return session;
    } catch (error) {
      memorySession = null;
      return null;
    }
  };

  const saveSession = function (_storage, session) {
    memorySession = session ? { ...session } : null;
  };

  const clearSession = function () {
    memorySession = null;
  };

  window.HPGB_APP = {
    MOCK_DATA,
    MOCK_CONFIG,
    DEMO_MODE,
    USE_MOCK_DATA,
    getMockList,
    getMockObject,
    getFirst,
    getConfigList,
    getConfigObject,
    getConfigValue,
    maskAccountNumber,
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
    APP_NAME,
    APP_NAME_SUP,
    BANK_NAME,
    BANK_SHORT_NAME,
    APP_VERSION,
    APP_TITLE,
    APP_SUBTITLE,
    DEFAULT_TOLL_FREE,
    DEFAULT_SUPPORT_EMAIL,
    START_APPLICATION_URL,
    PRIVACY_POLICY_URL,
    LOCATE_BRANCH_URL,
    WHATSAPP_BANKING_NUMBER,
    HOLIDAYS_LIST_URL,
    TERMS_URL,
    FORM_26AS_URL,
    BBPS_COMPLAINT_URL,
    WHATSAPP_BASE_URL,
    SOCIAL_FACEBOOK_HANDLE,
    SOCIAL_X_HANDLE,
    SOCIAL_INSTAGRAM_HANDLE,
    SOCIAL_YOUTUBE_HANDLE,
    SOCIAL_FACEBOOK_BASE_URL,
    SOCIAL_X_BASE_URL,
    SOCIAL_INSTAGRAM_BASE_URL,
    SOCIAL_YOUTUBE_BASE_URL,
    MOCK_LOGIN,
    USE_MOCK_LOGIN,
    MOCK_CARD_PIN,
    MOCK_DEVICE_ID,
    MOCK_ACCOUNTS,
    MOCK_CHEQUE_STATUS,
    MOCK_CHEQUE_UNUSED_RANGE,
    MOCK_LIMIT_MAX,
    MOCK_RD_ACCOUNTS,
    SESSION_DURATION_MS,
    isMockTransactionPasswordValid,
    readSession,
    saveSession,
    clearSession,
  };
})();
