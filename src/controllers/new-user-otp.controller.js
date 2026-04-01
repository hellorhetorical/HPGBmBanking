(() => {
  "use strict";

  const { MOCK_LOGIN, USE_MOCK_LOGIN } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("NewUserOtpController", [
    "$location",
    "$rootScope",
    "$interval",
    "$scope",
    function ($location, $rootScope, $interval, $scope) {
      const vm = this;
      const flow = $rootScope.newUserFlow;
      const params = $location.search();

      if (!flow || !flow.accountNumber) {
        $location.path("/new-user");
        return;
      }
      if (!params.account || String(params.account) !== String(flow.accountNumber)) {
        $location.path("/new-user").search({});
        return;
      }

      vm.accountNumber = flow.accountNumber;
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

      vm.verify = function () {
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
        $location.path("/new-user-mpin").search({ account: vm.accountNumber });
      };

      vm.goBack = function () {
        $location.path("/new-user").search({});
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
