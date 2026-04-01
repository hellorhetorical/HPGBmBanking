(() => {
  "use strict";

  window.MOCK_CONFIG = {
    DEMO_MODE: true,
    USE_MOCK_DATA: true,
    DEVICE_ID: "DEVICE-DEV-0001",
    DEFAULT_USER: { name: "Demo User", userId: "U00000001" },
    LOGIN_PASSWORD: "1234",
    TRANSACTION_PASSWORD: "4321",
    CARD_PIN: "1111",
    DEBIT_CARD_NUMBER: "1111111111111111",
    DEBIT_CARD_EXPIRY: "12/30",
    HOME_HIGHLIGHT_ACCOUNTS: [
      {
        title: "Savings Account",
        number: "10000000000011",
        balance: "10,000",
        showDetails: false,
      },
      {
        title: "Overdraft Account",
        number: "10000000000040",
        balance: "95,000",
        showDetails: false,
      },
      {
        title: "House Loan Account",
        number: "10000000000078",
        balance: "25,00,000",
        showDetails: false,
      },
      {
        title: "Fixed Deposit Account",
        number: "10000000000021",
        balance: "10,00,000",
        showDetails: false,
      },
    ],
  };
})();
