(() => {
  "use strict";

  const { MOCK_LOGIN, USE_MOCK_LOGIN, saveSession, SESSION_DURATION_MS } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("FirstLoginOtpController", [
    "$location",
    "$rootScope",
    "$interval",
    "$scope",
    "$window",
    "SecurityService",
    function ($location, $rootScope, $interval, $scope, $window, SecurityService) {
      const vm = this;
      const PIN_UPDATED_AT_KEY = "hpgb.auth.pinUpdatedAt";
      const pending = $rootScope.firstLoginSetup;
      const params = $location.search();

      if (!pending || !pending.userId || !pending.mpin || !pending.tpin) {
        $location.path("/");
        return;
      }
      if (!params.userId || params.userId !== pending.userId) {
        $location.path("/first-login").search({ userId: pending.userId });
        return;
      }

      vm.userId = pending.userId;
      vm.otpDigits = ["", "", "", "", "", ""];
      vm.error = "";
      vm.timerSeconds = 60;
      vm.canResend = false;

      const getOtpInputs = function (target) {
        if (target && typeof target.closest === "function") {
          const group = target.closest(".binddevice-otp-inputs");
          if (group) {
            return group.querySelectorAll(".binddevice-otp-input");
          }
        }
        return document.querySelectorAll(".binddevice-otp-inputs .binddevice-otp-input");
      };

      const focusOtpInput = function (index, inputs) {
        if (!inputs || !inputs.length) {
          return;
        }
        const next = inputs[index];
        if (next) {
          next.focus();
        }
      };

      vm.goBack = function () {
        $location.path("/first-login").search({ userId: vm.userId });
      };

      vm.onOtpKeyup = function (index, $event) {
        const inputs = getOtpInputs($event.target);
        if (!inputs.length) {
          return;
        }
        const key = $event.key;
        const target = $event.target;

        if (key === "Backspace" && !target.value && index > 0) {
          focusOtpInput(index - 1, inputs);
          return;
        }
        if (target.value && index < inputs.length - 1) {
          focusOtpInput(index + 1, inputs);
        }
      };

      const startTimer = function () {
        vm.timerSeconds = 60;
        vm.canResend = false;
        if (vm.timerPromise) {
          $interval.cancel(vm.timerPromise);
        }
        vm.timerPromise = $interval(() => {
          vm.timerSeconds -= 1;
          if (vm.timerSeconds <= 0) {
            vm.timerSeconds = 0;
            vm.canResend = true;
            $interval.cancel(vm.timerPromise);
            vm.timerPromise = null;
          }
        }, 1000);
      };

      vm.resendOtp = function () {
        vm.otpDigits = ["", "", "", "", "", ""];
        vm.error = "";
        startTimer();
      };

      vm.verify = async function () {
        if (vm.otpDigits.some((digit) => !digit)) {
          vm.error = "Please enter the complete OTP.";
          return;
        }
        const enteredOtp = vm.otpDigits.join("").trim();
        if (USE_MOCK_LOGIN && enteredOtp !== MOCK_LOGIN.otp) {
          vm.error = "We couldn't verify the OTP. Please check the code and try again.";
          return;
        }
        vm.error = "";

        try {
          const now = Date.now();
          if (MOCK_LOGIN) {
            MOCK_LOGIN.password = pending.mpin;
            MOCK_LOGIN.transactionPassword = pending.tpin;
            MOCK_LOGIN.login = 1;
            MOCK_LOGIN.pinUpdatedAt = new Date(now).toISOString();
          }
          try {
            $window.localStorage.setItem(PIN_UPDATED_AT_KEY, String(now));
          } catch (error) {
          }

          await SecurityService.setMpin(pending.mpin);
          SecurityService.markUnlocked();

          $rootScope.currentUser = {
            name: pending.name || pending.userId,
            userId: pending.userId,
          };
          $rootScope.lastLoginAt = new Date().toISOString();
          saveSession(null, {
            user: $rootScope.currentUser,
            lastLoginAt: $rootScope.lastLoginAt,
            expiresAt: SESSION_DURATION_MS ? Date.now() + SESSION_DURATION_MS : null,
          });
          $rootScope.isAuthenticated = true;
          $rootScope.firstLoginSetup = null;
          $rootScope.bindResult = {
            status: "success",
            message: "MPIN and TPIN set successfully.",
          };
          $location.path("/home");
        } catch (error) {
          vm.error = error && error.message ? error.message : "Unable to complete setup.";
        }
      };

      startTimer();

      $scope.$on("$destroy", () => {
        if (vm.timerPromise) {
          $interval.cancel(vm.timerPromise);
        }
      });
    },
  ]);
})();
