(() => {
  "use strict";
  const {
    DEMO_MODE,
    APP_NAME,
    APP_NAME_SUP,
    BANK_NAME,
    BANK_SHORT_NAME,
    APP_VERSION,
    APP_TITLE,
    APP_SUBTITLE,
    PRIVACY_POLICY_URL,
    LOCATE_BRANCH_URL,
    HOLIDAYS_LIST_URL,
    FORM_26AS_URL,
    BBPS_COMPLAINT_URL,
    WHATSAPP_BASE_URL,
    SOCIAL_FACEBOOK_BASE_URL,
    SOCIAL_X_BASE_URL,
    SOCIAL_INSTAGRAM_BASE_URL,
    SOCIAL_YOUTUBE_BASE_URL,
  } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("MainController", [
      "$location",
      "$rootScope",
      "$window",
      function ($location, $rootScope, $window) {
        const vm = this;
        const splashStartTime = Date.now();
        const routeIndexMap = {
          "/": 0,
          "/home": 0,
          "/loans": 1,
          "/faq": 2,
          "/support": 3,
          "/more": 3,
        };
        const bottomNavRoutes = Object.keys(routeIndexMap);
        const TOP_BAR_COLOR = "#1068b2";
        const cap = $window.Capacitor;
        const navigationBar =
          cap && cap.Plugins && cap.Plugins.NavigationBar ? cap.Plugins.NavigationBar : null;
        const statusBar = cap && cap.Plugins && cap.Plugins.StatusBar ? cap.Plugins.StatusBar : null;
        const getNavBarStyle = (path) => {
          if (bottomNavRoutes.includes(path)) {
            return { color: "#ffffff", darkButtons: true, statusBarStyle: "DARK" };
          }
          return { color: "#f2f4f7", darkButtons: true, statusBarStyle: "DARK" };
        };
        const routeTitleMap = {
          "/": "Login",
          "/home": "Home",
          "/accounts": "Accounts",
          "/activity": "Activity",
          "/settings": "Settings",
          "/settings/security": "Security",
          "/lock": "Unlock",
          "/support": "Support",
          "/more": "More",
          "/socialmedia": "Social Media",
          "/loans": "Loans",
          "/calculator": "Calculators",
          "/initiatetransfer": "Make A Transfer",
          "/transfer-status": "Transfer Status",
          "/transfer-otp": "OTP Verification",
          "/beneficiaries": "My Payees",
          "/beneficiaries/add": "Add New Payee",
          "/beneficiaries/confirm": "Confirm and Authorize",
          "/beneficiaries/status": "Status",
          "/quickpay": "Quick Pay",
          "/quickpay-otp": "OTP Verification",
          "/quickpay-status": "Status",
          "/account-view": "My Account",
          "/account-details": "A/c Details",
          "/hostlist-debit-card": "Hostlist Debit Card",
          "/generate-green-pin": "Generate Green PIN",
          "/card-management": "Card Management",
          "/limit-management": "Limit Management",
          "/limit-atm": "Update ATM Limit",
          "/limit-pos": "Update POS Limit",
          "/limit-ecomm": "Update EComm Limit",
          "/limit-contactless": "Update Contactless Limit",
          "/open-rd": "Open RD",
          "/open-fd": "Open FD",
          "/fd-closure": "FD Closure",
          "/track-fd-status": "Track FD Status",
          "/mpassbook": "mPassbook",
          "/pmjjby": "PMJJBY",
          "/pmsby": "PMSBY",
          "/apy": "APY",
          "/inquire-cheque": "Inquire Cheque",
          "/stop-cheque": "Stop Cheque",
          "/view-cheque": "View Cheque",
          "/pps": "PPS",
          "/year-wise-statement": "Year Wise Statement",
          "/mini-statement": "Mini Statement",
          "/emi": "EMI Calculator",
          "/emimoratorium": "EMI Moratorium",
          "/interest": "Interest Calculator",
          "/rd": "RD Calculator",
          "/fd": "FD Calculator",
          "/updates": "Updates",
          "/faq": "FAQ",
          "/license": "Open Source Licenses",
          "/search": "Search",
          "/binddevice": "Bind Device",
          "/otp": "Verify OTP",
          "/new-user": "New User",
          "/new-user-otp": "OTP Verification",
          "/new-user-mpin": "Set MPIN",
          "/new-user-success": "Registration Complete",
          "/first-login": "Set MPIN & TPIN",
          "/first-login-otp": "OTP Verification",
          "/forgot-otp": "OTP Verification",
          "/forgot-card": "Debit Card Verification",
          "/forgot-reset": "Change PIN",
        };

        vm.status = "ready";
        vm.isMenuOpen = false;
        vm.isDotsOpen = false;
        vm.activeIndex = -1;
        vm.showExitPrompt = false;
        vm.showForgotPrompt = false;
        vm.showExternalPrompt = false;
        vm.externalUrl = "";
        vm.externalHost = "";
        vm.externalCopyMessage = "";
        vm.externalCopyTimer = null;
        vm.showBottomNav = true;
        vm.showBack = false;
        vm.showSearchIcon = false;
        vm.isLocked = false;
        vm.isTerms = false;
        vm.isOverview = false;
        const shortName = BANK_SHORT_NAME || "bankshortname";
        vm.pageTitle = APP_TITLE || `${shortName} mBanking`;
        vm.isAuthenticated = false;
        vm.user = null;
        vm.isDemoMode = !!DEMO_MODE;
        vm.appName = APP_NAME || `${shortName}mBanking`;
        vm.appNameSup = APP_NAME_SUP || "Plus";
        vm.bankName = BANK_NAME || "bankname";
        vm.appVersion = APP_VERSION || "1.0.0";
        vm.appTitle = APP_TITLE || `${shortName} mBanking`;
        vm.appSubtitle = APP_SUBTITLE || "Secure mobile access";
        vm.privacyPolicyUrl = PRIVACY_POLICY_URL || "";
        const safeExternalOrigins = new Set();
        const addSafeOrigin = function (url) {
          if (!url) {
            return;
          }
          try {
            safeExternalOrigins.add(new URL(url).origin);
          } catch (error) {
          }
        };
        [
          PRIVACY_POLICY_URL,
          LOCATE_BRANCH_URL,
          HOLIDAYS_LIST_URL,
          FORM_26AS_URL,
          BBPS_COMPLAINT_URL,
          WHATSAPP_BASE_URL,
          SOCIAL_FACEBOOK_BASE_URL,
          SOCIAL_X_BASE_URL,
          SOCIAL_INSTAGRAM_BASE_URL,
          SOCIAL_YOUTUBE_BASE_URL,
        ].forEach(addSafeOrigin);
        vm.getMaskedUserId = function (value) {
          const raw = (value || "").toString();
          if (!raw) {
            return "--";
          }
          if (raw.length <= 4) {
            return "****";
          }
          return `${raw.slice(0, 2)}****${raw.slice(-2)}`;
        };
        $rootScope.appTitle = vm.appTitle;
        $rootScope.appSubtitle = vm.appSubtitle;
        vm.pageTitle = vm.appTitle;
        vm.isPageLoading = false;
        vm.showSplash = true;
        vm.splashFading = false;
        let viewLoaded = false;
        let windowLoaded = false;

        const tryHideSplash = function () {
            if (viewLoaded && windowLoaded) {
              const elapsed = Date.now() - splashStartTime;
              const remaining = Math.max(0, 3000 - elapsed);
              
              $window.setTimeout(() => {
                vm.splashFading = true;
                $rootScope.$applyAsync();
                
                $window.setTimeout(() => {
                  vm.showSplash = false;
                  if (statusBar && typeof statusBar.show === "function") {
                    statusBar.show().catch(() => {});
                  }

                  const tempStyle = $window.document.getElementById("splash-temp-style");
                  if (tempStyle) {
                    tempStyle.remove();
                  }
                  const metaTheme = $window.document.querySelector('meta[name="theme-color"]');
                  if (metaTheme) {
                    metaTheme.setAttribute("content", "#1068b2");
                  }
                  
                  $rootScope.$applyAsync();
                }, 600); 
              }, remaining);
            }
          };

        if (vm.showSplash && statusBar && typeof statusBar.hide === "function") {
          statusBar.hide().catch(() => {});
        }

        const supportsInert = "inert" in $window.document.createElement("div");
        let menuFallbackFocusables = [];
        let contentFallbackFocusables = [];

        const setFocusableState = function (elements, enabled) {
          elements.forEach((element) => {
            if (!element) {
              return;
            }
            if (enabled) {
              if (element.hasAttribute("data-prev-tabindex")) {
                const prev = element.getAttribute("data-prev-tabindex");
                element.removeAttribute("data-prev-tabindex");
                if (prev === "") {
                  element.removeAttribute("tabindex");
                } else {
                  element.setAttribute("tabindex", prev);
                }
              }
            } else if (!element.hasAttribute("data-prev-tabindex")) {
              const prevTabindex = element.getAttribute("tabindex");
              element.setAttribute("data-prev-tabindex", prevTabindex === null ? "" : prevTabindex);
              element.setAttribute("tabindex", "-1");
            }
          });
        };

        const collectMenuFocusables = function () {
          const menu = $window.document.getElementById("side-menu");
          if (!menu) {
            return [];
          }
          return getFocusableElements(menu);
        };

        const collectContentFocusables = function () {
          const content = $window.document.querySelector(".content");
          const bottomNav = $window.document.querySelector(".bottom-actionbar");
          const elements = [];
          if (content) {
            elements.push(...getFocusableElements(content));
          }
          if (bottomNav) {
            elements.push(...getFocusableElements(bottomNav));
          }
          return elements;
        };

        const toggleMenuFallbackFocus = function (isOpen) {
          if (supportsInert) {
            return;
          }
          if (isOpen) {
            contentFallbackFocusables = collectContentFocusables();
            setFocusableState(contentFallbackFocusables, false);
            menuFallbackFocusables = collectMenuFocusables();
            setFocusableState(menuFallbackFocusables, true);
          } else {
            setFocusableState(contentFallbackFocusables, true);
            menuFallbackFocusables = collectMenuFocusables();
            setFocusableState(menuFallbackFocusables, false);
            contentFallbackFocusables = [];
          }
        };

        vm.openMenu = function () {
          vm.lastActiveElement = $window.document.activeElement;
          vm.isMenuOpen = true;
          $rootScope.isMenuOpen = true;
          toggleMenuFallbackFocus(true);
          $window.setTimeout(() => {
            const closeButton = $window.document.getElementById("menu-close-button");
            if (closeButton && typeof closeButton.focus === "function") {
              closeButton.focus();
            }
          }, 0);
        };
        vm.closeMenu = function () {
          vm.isMenuOpen = false;
          vm.isDotsOpen = false;
          $rootScope.isMenuOpen = false;
          toggleMenuFallbackFocus(false);
          restoreLastFocus();
        };
        vm.toggleDots = function () {
          vm.isDotsOpen = !vm.isDotsOpen;
        };

        vm.setActive = function (index) {
          vm.activeIndex = index;
        };

        vm.lastActiveElement = null;

        const focusElementById = function (id) {
          $window.setTimeout(() => {
            const element = $window.document.getElementById(id);
            if (element && typeof element.focus === "function") {
              element.focus();
            }
          }, 0);
        };

        const restoreLastFocus = function () {
          $window.setTimeout(() => {
            if (vm.lastActiveElement && typeof vm.lastActiveElement.focus === "function") {
              vm.lastActiveElement.focus();
            }
          }, 0);
        };

        const getFocusableElements = function (container) {
          if (!container) {
            return [];
          }
          const focusables = container.querySelectorAll(
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
          );
          return Array.from(focusables).filter((node) => {
            return node.offsetParent !== null || node === $window.document.activeElement;
          });
        };

        const getOpenModal = function () {
          return $window.document.querySelector(".modal-sheet.open, .beneficiary-sheet.open");
        };

        const closeOpenModal = function () {
          if (vm.showExitPrompt) {
            vm.cancelExit();
            return true;
          }
          if (vm.showForgotPrompt) {
            vm.closeForgotPrompt();
            return true;
          }
          if (vm.showExternalPrompt) {
            vm.closeExternalPrompt();
            return true;
          }
          const rechargeClose = $window.document.getElementById("recharge-plan-close");
          if (rechargeClose && $window.document.querySelector(".modal-sheet.open")) {
            rechargeClose.click();
            return true;
          }
          const beneficiaryClose = $window.document.getElementById("beneficiary-sheet-cancel");
          if (beneficiaryClose && $window.document.querySelector(".beneficiary-sheet.open")) {
            beneficiaryClose.click();
            return true;
          }
          const backdrops = $window.document.querySelectorAll(
            ".modal-backdrop.open, .beneficiary-sheet-backdrop.open"
          );
          if (!backdrops.length) {
            return false;
          }
          const backdrop = backdrops[backdrops.length - 1];
          if (backdrop && typeof backdrop.click === "function") {
            backdrop.click();
            return true;
          }
          return false;
        };

        const handleMenuKeydown = function (event) {
          if (!event || !vm.isMenuOpen) {
            return;
          }
          if (event.key === "Escape") {
            event.preventDefault();
            vm.closeMenu();
            return;
          }
          if (event.key !== "Tab") {
            return;
          }
          const menu = $window.document.getElementById("side-menu");
          if (!menu) {
            return;
          }
          const focusable = getFocusableElements(menu);
          if (!focusable.length) {
            event.preventDefault();
            if (typeof menu.focus === "function") {
              menu.focus();
            }
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && $window.document.activeElement === first) {
            event.preventDefault();
            last.focus();
            return;
          }
          if (!event.shiftKey && $window.document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        };

        const handleModalKeydown = function (event) {
          if (!event) {
            return;
          }
          if (event.key === "Escape") {
            if (closeOpenModal()) {
              event.preventDefault();
            }
            return;
          }
          if (event.key !== "Tab") {
            return;
          }
          const modal = getOpenModal();
          if (!modal) {
            return;
          }
          const focusable = getFocusableElements(modal);
          if (!focusable.length) {
            event.preventDefault();
            if (typeof modal.focus === "function") {
              modal.focus();
            }
            return;
          }
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && $window.document.activeElement === first) {
            event.preventDefault();
            last.focus();
            return;
          }
          if (!event.shiftKey && $window.document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        };

        $window.document.addEventListener("keydown", handleMenuKeydown, true);
        $window.document.addEventListener("keydown", handleModalKeydown, true);

        const handleExternalLinkClick = function (event) {
          const target = event.target;
          if (!target || typeof target.closest !== "function") {
            return;
          }
          const link = target.closest("a");
          if (!link) {
            return;
          }
          const href = link.getAttribute("href");
          if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
            return;
          }
          let resolvedUrl = null;
          try {
            resolvedUrl = new URL(href, $window.location.href);
          } catch (error) {
            return;
          }
          if (!resolvedUrl || !/^https?:$/i.test(resolvedUrl.protocol)) {
            return;
          }
          const isSameOrigin = resolvedUrl.origin === $window.location.origin;
          const isSafeOrigin = safeExternalOrigins.has(resolvedUrl.origin);
          if (isSameOrigin || isSafeOrigin) {
            return;
          }
          event.preventDefault();
          $rootScope.$applyAsync(() => {
            vm.openExternalPrompt(resolvedUrl.href);
          });
        };

        $window.document.addEventListener("click", handleExternalLinkClick, true);

        vm.confirmExit = function () {
          vm.showExitPrompt = false;
          restoreLastFocus();
          if (typeof $rootScope.appExit === "function") {
            $rootScope.appExit();
          }
        };

        vm.cancelExit = function () {
          vm.showExitPrompt = false;
          restoreLastFocus();
        };

        vm.openForgotPrompt = function () {
          vm.lastActiveElement = $window.document.activeElement;
          vm.showForgotPrompt = true;
          $rootScope.isForgotPromptOpen = true;
          focusElementById("forgot-login-button");
        };

        vm.closeForgotPrompt = function () {
          vm.showForgotPrompt = false;
          $rootScope.isForgotPromptOpen = false;
          restoreLastFocus();
        };

        vm.openExternalPrompt = function (url) {
          if (!url) {
            return;
          }
          vm.lastActiveElement = $window.document.activeElement;
          vm.externalUrl = url;
          vm.externalHost = "";
          vm.externalCopyMessage = "";
          if (vm.externalCopyTimer) {
            $window.clearTimeout(vm.externalCopyTimer);
            vm.externalCopyTimer = null;
          }
          try {
            vm.externalHost = new URL(url).host;
          } catch (error) {
            vm.externalHost = "";
          }
          vm.showExternalPrompt = true;
          focusElementById("external-continue-button");
        };

        vm.closeExternalPrompt = function () {
          vm.showExternalPrompt = false;
          vm.externalUrl = "";
          vm.externalHost = "";
          vm.externalCopyMessage = "";
          if (vm.externalCopyTimer) {
            $window.clearTimeout(vm.externalCopyTimer);
            vm.externalCopyTimer = null;
          }
          restoreLastFocus();
        };

        vm.copyExternalUrl = function () {
          const url = vm.externalUrl;
          if (!url) {
            return;
          }
          if ($window.navigator && $window.navigator.clipboard) {
            $window.navigator.clipboard.writeText(url).catch(() => {});
          } else {
            const textarea = $window.document.createElement("textarea");
            textarea.value = url;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "absolute";
            textarea.style.left = "-9999px";
            $window.document.body.appendChild(textarea);
            textarea.select();
            try {
              $window.document.execCommand("copy");
            } catch (error) {
            }
            $window.document.body.removeChild(textarea);
          }
          vm.externalCopyMessage = "Link copied";
          if (vm.externalCopyTimer) {
            $window.clearTimeout(vm.externalCopyTimer);
          }
          vm.externalCopyTimer = $window.setTimeout(() => {
            $rootScope.$applyAsync(() => {
              vm.externalCopyMessage = "";
              vm.externalCopyTimer = null;
            });
          }, 2000);
        };

        vm.confirmExternal = function () {
          const url = vm.externalUrl;
          vm.closeExternalPrompt();
          if (url) {
            $window.open(url, "_blank", "noopener,noreferrer");
          }
        };

        vm.goBack = function () {
          if ($location.path() === "/transfer-status") {
            const flowType =
              ($rootScope.transferSummary && $rootScope.transferSummary.flowType) || "own";
            $location.path("/initiatetransfer").search({ type: flowType });
            return;
          }
          if ($location.path() === "/quickpay-status") {
            $location.path("/quickpay");
            return;
          }
          if ($location.path().startsWith("/beneficiaries")) {
            $location.path("/home");
            return;
          }
          window.history.back();
        };

        vm.logout = function () {
          if (typeof $rootScope.logout === "function") {
            $rootScope.logout();
          }
          vm.closeMenu();
        };

        $rootScope.openMenu = vm.openMenu;
        $rootScope.closeMenu = vm.closeMenu;

      vm.goForgotFlow = function (flow) {
        vm.closeForgotPrompt();
        $location.path(`/forgot/${flow}`);
      };

      $rootScope.openForgotPrompt = vm.openForgotPrompt;
      $rootScope.closeForgotPrompt = vm.closeForgotPrompt;

        $rootScope.$on("$routeChangeStart", (event, next) => {
          const nextPath = next && next.originalPath ? next.originalPath : "";
          const shouldSkip = nextPath === "/" || nextPath === "/terms";
          vm.isPageLoading = !shouldSkip;
          $rootScope.$applyAsync();
        });

        const stopViewLoaded = $rootScope.$on("$viewContentLoaded", () => {
          vm.isPageLoading = false;
          viewLoaded = true;
          tryHideSplash();
          $rootScope.$applyAsync();
        });

        $rootScope.$on("$routeChangeError", () => {
          vm.isPageLoading = false;
          $rootScope.$applyAsync();
        });

        const onWindowLoad = function () {
          windowLoaded = true;
          tryHideSplash();
          $rootScope.$applyAsync();
        };

        $window.addEventListener("load", onWindowLoad, { once: true });

        $rootScope.$on("exitPrompt", () => {
          vm.lastActiveElement = $window.document.activeElement;
          vm.showExitPrompt = true;
          focusElementById("exit-cancel-button");
        });

        const updateActive = function () {
          const path = $location.path() || "/";
          vm.activeIndex = Object.prototype.hasOwnProperty.call(routeIndexMap, path)
            ? routeIndexMap[path]
            : -1;
          vm.showBottomNav = bottomNavRoutes.includes(path);
          vm.showBack = !vm.showBottomNav && path !== "/" && path !== "/lock" && path !== "/terms";
          vm.showSearchIcon = path === "/home";
          vm.isLocked = path === "/lock";
          vm.isTerms = path === "/terms";
          vm.isOverview = path === "/";
          if (path.startsWith("/forgot/")) {
            vm.pageTitle = "Verify User ID";
          } else {
            vm.pageTitle = routeTitleMap[path] || vm.appTitle;
          }
          $window.document.title = vm.appName;
          const navStyle = getNavBarStyle(path);
          if (navigationBar) {
            navigationBar
              .setNavigationBarColor({ color: navStyle.color, darkButtons: navStyle.darkButtons })
              .catch(() => {});
          }
          if (statusBar) {
            statusBar.setBackgroundColor({ color: TOP_BAR_COLOR }).catch(() => {});
            statusBar.setStyle({ style: navStyle.statusBarStyle }).catch(() => {});
          }
        };

        updateActive();
        toggleMenuFallbackFocus(vm.isMenuOpen);
        vm.isAuthenticated = !!$rootScope.isAuthenticated;
        vm.user = $rootScope.currentUser;
        $rootScope.$watch(
          () => $rootScope.isAuthenticated,
          (value) => {
            vm.isAuthenticated = !!value;
          }
        );
        $rootScope.$watch(
          () => $rootScope.currentUser,
          (value) => {
            vm.user = value;
          }
        );
        $rootScope.$on("$routeChangeSuccess", updateActive);
        $rootScope.$on("$destroy", () => {
          stopViewLoaded();
          $window.removeEventListener("load", onWindowLoad);
          $window.document.removeEventListener("keydown", handleMenuKeydown, true);
          $window.document.removeEventListener("keydown", handleModalKeydown, true);
          $window.document.removeEventListener("click", handleExternalLinkClick, true);
        });
      },
    ]);
})();
