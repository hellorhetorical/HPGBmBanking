(() => {
  "use strict";

  const { readSession, saveSession, clearSession, getMockList, MOCK_DATA, DEMO_MODE } =
    window.HPGB_APP || {};

  angular.module("hpgbmbanking").run([
      "$window",
      "$location",
      "$rootScope",
      "SecurityService",
      function ($window, $location, $rootScope, SecurityService) {
        const cap = $window.Capacitor;
        let termsAcceptedState = false;
        let securityReady = false;
        let session = DEMO_MODE ? readSession() : null;
        if (session && !session.lastLoginAt) {
          session = {
            ...session,
            lastLoginAt: new Date().toISOString(),
          };
          saveSession(null, session);
        }

        $rootScope.isAuthenticated = !!session;
        $rootScope.currentUser = session ? session.user : null;
        $rootScope.lastLoginAt = session ? session.lastLoginAt : null;
        $rootScope.termsAccepted = false;
        if (!Array.isArray($rootScope.beneficiariesList)) {
          $rootScope.beneficiariesList = getMockList(MOCK_DATA.BENEFICIARIES_LIST);
        }

        $rootScope.logout = function () {
          clearSession();
          $rootScope.isAuthenticated = false;
          $rootScope.currentUser = null;
          $rootScope.lastLoginAt = null;
          $location.path("/");
        };
        $rootScope.setTermsAccepted = function (value) {
          termsAcceptedState = !!value;
          $rootScope.termsAccepted = termsAcceptedState;
        };

        const enforceSecurity = function () {
          if (!$rootScope.isAuthenticated) {
            return;
          }
          const path = $location.path() || "/";
          if (SecurityService.hasMpin() && SecurityService.shouldLock() && path !== "/lock") {
            SecurityService.setIntendedPath(path);
            $location.path("/lock");
          }
        };

        SecurityService.ensureReady().then(() => {
          securityReady = true;
          enforceSecurity();
          $rootScope.$applyAsync();
        });
        if (cap && cap.Plugins && cap.Plugins.StatusBar) {
          const statusBar = cap.Plugins.StatusBar;
          statusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
        }

        if (cap && cap.Plugins && cap.Plugins.NavigationBar) {
          const navigationBar = cap.Plugins.NavigationBar;
          navigationBar
            .setNavigationBarColor({ color: "#ffffff", darkButtons: true })
            .catch(() => {});
        }

        if (cap && cap.Plugins && cap.Plugins.App) {
          const app = cap.Plugins.App;
          $rootScope.appExit = () => app.exitApp();
          const navStack = [];
          const MAX_NAV_STACK = 50;
          const pushPath = function () {
            const path = $location.path() || "/";
            if (path === "/lock") {
              return;
            }
            if (navStack.length === 0 || navStack[navStack.length - 1] !== path) {
              navStack.push(path);
              if (navStack.length > MAX_NAV_STACK) {
                navStack.shift();
              }
            }
          };

          pushPath();
          $rootScope.$on("$routeChangeSuccess", pushPath);

          app.addListener("backButton", () => {
            if ($rootScope.isMenuOpen && typeof $rootScope.closeMenu === "function") {
              $rootScope.closeMenu();
              $rootScope.$applyAsync();
              return;
            }
            if ($rootScope.isForgotPromptOpen && $rootScope.closeForgotPrompt) {
              $rootScope.closeForgotPrompt();
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/lock") {
              SecurityService.setIntendedPath("/home");
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/home") {
              $rootScope.$broadcast("exitPrompt");
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/") {
              $rootScope.$broadcast("exitPrompt");
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/transfer-status") {
              const flowType =
                ($rootScope.transferSummary && $rootScope.transferSummary.flowType) || "own";
              $location.path("/initiatetransfer").search({ type: flowType });
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/quickpay-status") {
              $location.path("/quickpay");
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path().startsWith("/beneficiaries")) {
              $location.path("/home");
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/otp") {
              $location.path("/");
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/forgot-otp") {
              $location.path("/");
              $rootScope.$applyAsync();
              return;
            }
            if ($location.path() === "/forgot-card") {
              const flow = $location.search().flow || "login";
              $location.path(`/forgot/${flow}`).search({});
              $rootScope.$applyAsync();
              return;
            }
            if (navStack.length > 1) {
              navStack.pop();
              $location.path(navStack[navStack.length - 1]);
              $rootScope.$applyAsync();
              return;
            }
            $rootScope.$broadcast("exitPrompt");
            $rootScope.$applyAsync();
          });

          app.addListener("appStateChange", (state) => {
            if (!state.isActive) {
              SecurityService.lock();
              return;
            }
            const activeSession = DEMO_MODE ? readSession() : null;
            if (!activeSession) {
              if ($location.path() !== "/") {
                $location.path("/");
                $rootScope.$applyAsync();
              }
              return;
            }
            if (SecurityService.hasMpin() && SecurityService.shouldLock()) {
              const path = $location.path() || "/home";
              if (path !== "/lock") {
                SecurityService.setIntendedPath(path);
                $location.path("/lock");
                $rootScope.$applyAsync();
              }
            }
          });
        }

        let currentPath = $location.path() || "/";
        $rootScope.$on("$routeChangeSuccess", () => {
          currentPath = $location.path() || "/";
        });

        $rootScope.$on("$routeChangeStart", (event, next) => {
          const termsAccepted = termsAcceptedState;
          let activeSession = DEMO_MODE ? readSession() : null;
          if (activeSession && !activeSession.lastLoginAt) {
            activeSession = {
              ...activeSession,
              lastLoginAt: new Date().toISOString(),
            };
            saveSession(null, activeSession);
          }
          $rootScope.isAuthenticated = !!activeSession;
          $rootScope.currentUser = activeSession ? activeSession.user : null;
          $rootScope.lastLoginAt = activeSession ? activeSession.lastLoginAt : null;
          const nextPath = next && next.originalPath ? next.originalPath : "";

          const publicWhenTermsPending = ["/terms", "/settings/notifications"];
          if (!termsAccepted && !publicWhenTermsPending.includes(nextPath)) {
            event.preventDefault();
            $location.path("/terms");
            return;
          }
          if (termsAccepted && nextPath === "/terms") {
            event.preventDefault();
            $location.path("/");
            return;
          }

          if (securityReady && activeSession) {
            if (SecurityService.hasMpin() && SecurityService.shouldLock() && nextPath !== "/lock") {
              event.preventDefault();
              SecurityService.setIntendedPath(nextPath || "/home");
              $location.path("/lock");
              return;
            }
          }

          if (next && next.originalPath === "/transfer-status" && currentPath !== "/transfer-otp") {
            event.preventDefault();
            const flowType =
              ($rootScope.transferSummary && $rootScope.transferSummary.flowType) || "own";
            $location.path("/initiatetransfer").search({ type: flowType });
            return;
          }

          if (activeSession && next && next.originalPath === "/") {
            event.preventDefault();
            $location.path("/home");
            return;
          }

          if (!activeSession && next && next.originalPath === "/home") {
            event.preventDefault();
            $location.path("/");
            return;
          }

          if (
            !activeSession &&
            next &&
            next.originalPath &&
            next.originalPath.startsWith("/settings") &&
            next.originalPath !== "/settings/notifications"
          ) {
            event.preventDefault();
            $location.path("/");
          }
        });
      },
    ]);
})();
