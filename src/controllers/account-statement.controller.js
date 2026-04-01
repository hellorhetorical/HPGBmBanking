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
    BANK_SHORT_NAME,
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

  angular.module("hpgbmbanking").controller("AccountStatementController", [
      "$window",
      "$scope",
      function ($window, $scope) {
      const vm = this;
      vm.title = "Account Statement";
      vm.subtitle = "Download statements for the last 366 days.";
      vm.accounts = getMockList(MOCK_DATA.ACCOUNT_STATEMENT_ACCOUNTS);
      vm.statementForm = {
        account: getFirst(vm.accounts),
        rangeType: "week",
        specificDate: "",
        rangeStart: "",
        rangeEnd: "",
      };
      vm.showPdfPassword = false;
      vm.togglePdfPassword = function () {
        vm.showPdfPassword = !vm.showPdfPassword;
        if (vm.pdfHideTimer) {
          $window.clearTimeout(vm.pdfHideTimer);
          vm.pdfHideTimer = null;
        }
        if (vm.showPdfPassword) {
          vm.pdfHideTimer = $window.setTimeout(() => {
            vm.showPdfPassword = false;
            vm.pdfHideTimer = null;
          }, 10000);
        }
      };

      vm.maskAccount = function (number) {
        const digits = (number || "").toString().replace(/\D/g, "");
        const last4 = digits.slice(-4);
        return `XXXXXXXXXXXX${last4}`;
      };

      const formatDate = function (value) {
        if (!value) {
          return null;
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return null;
        }
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      vm.getStatementWindow = function () {
        if (!vm.statementForm.account) {
          return null;
        }
        const rangeType = vm.statementForm.rangeType;
        if (rangeType === "week") {
          const end = new Date();
          const start = new Date(end);
          start.setDate(end.getDate() - 6);
          return `${formatDate(start)} - ${formatDate(end)}`;
        }
        if (rangeType === "date") {
          return formatDate(vm.statementForm.specificDate);
        }
        if (rangeType === "range") {
          const startLabel = formatDate(vm.statementForm.rangeStart);
          const endLabel = formatDate(vm.statementForm.rangeEnd);
          if (!startLabel || !endLabel) {
            return null;
          }
          return `${startLabel} - ${endLabel}`;
        }
        return null;
      };

      vm.isStatementReady = function () {
        return !!vm.getStatementWindow();
      };

      $scope.$on("$destroy", () => {
        if (vm.pdfHideTimer) {
          $window.clearTimeout(vm.pdfHideTimer);
        }
      });
      const sanitizePdfText = function (value) {
        return (value || "")
          .toString()
          .replace(/\\/g, "\\\\")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)")
          .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "?");
      };

      const buildStatementPdf = function (lines) {
        const safeLines = lines.map((line) => sanitizePdfText(line));
        const contentStream = [
          "BT",
          "/F1 12 Tf",
          "72 720 Td",
          "14 TL",
          ...safeLines.map((line, index) => (index === 0 ? `(${line}) Tj` : `T* (${line}) Tj`)),
          "ET",
        ].join("\n");
        const objects = [];
        const addObject = function (body) {
          objects.push(body);
        };
        addObject("<< /Type /Catalog /Pages 2 0 R >>");
        addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        addObject(
          "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"
        );
        addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
        addObject(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);

        let offset = 0;
        const header = "%PDF-1.4\n";
        offset += header.length;
        const offsets = ["0000000000 65535 f "];
        const bodyParts = objects.map((body, index) => {
          const objNumber = index + 1;
          const entry = `${objNumber} 0 obj\n${body}\nendobj\n`;
          offsets.push(`${offset.toString().padStart(10, "0")} 00000 n `);
          offset += entry.length;
          return entry;
        });
        const xrefOffset = offset;
        const xref = `xref\n0 ${objects.length + 1}\n${offsets.join("\n")}\n`;
        const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
        return header + bodyParts.join("") + xref + trailer;
      };

      vm.downloadStatement = function () {
        if (!vm.isStatementReady()) {
          return;
        }
        const account = vm.statementForm.account;
        const period = vm.getStatementWindow();
        const shortName = BANK_SHORT_NAME || "bankshortname";
        const lines = [
          `${shortName} Account Statement`,
          `Account: ${account.type} ${account.number}`,
          `Period: ${period}`,
          `Branch: ${account.branch}`,
          `Currency: ${account.currency}`,
          `Balance: INR ${account.balance}`,
        ];
        const pdfContent = buildStatementPdf(lines);
        const filename = `${account.number}_statement.pdf`;
        const blob = new Blob([pdfContent], { type: "application/pdf" });
        if ($window.navigator && $window.navigator.msSaveOrOpenBlob) {
          $window.navigator.msSaveOrOpenBlob(blob, filename);
          return;
        }
        const url =
          $window.URL && $window.URL.createObjectURL
            ? $window.URL.createObjectURL(blob)
            : null;
        if (url) {
          const link = $window.document.createElement("a");
          link.href = url;
          link.download = filename;
          link.rel = "noopener";
          link.style.display = "none";
          $window.document.body.appendChild(link);
          link.click();
          link.remove();
          $window.URL.revokeObjectURL(url);
          return;
        }
        const dataUrl = `data:application/pdf,${encodeURIComponent(pdfContent)}`;
        $window.open(dataUrl, "_blank");
      };
    },
    ]);
})();
