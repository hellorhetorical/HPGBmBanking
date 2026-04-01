(() => {
  "use strict";

  angular.module("hpgbmbanking").directive("pinInput", [
    "$timeout",
    function ($timeout) {
      return {
        restrict: "E",
        require: "ngModel",
        scope: {
          ngModel: "=",
          pinLabel: "@?",
          ngDisabled: "=?",
        },
        template:
          '<div class="pin-input">' +
          '  <div class="binddevice-otp-inputs pin-inputs" role="group" ng-attr-aria-label="{{ pinLabel || \'PIN\' }}">' +
          '    <div class="otp-input-wrapper" ng-repeat="digit in digits track by $index" ng-attr-data-filled="{{ digit ? \'true\' : \'false\' }}">' +
          '      <input class="binddevice-otp-input" type="password" maxlength="1" inputmode="numeric" autocomplete="one-time-code" ng-model="digits[$index]" ng-disabled="ngDisabled" ng-keydown="onKeydown($index, $event)" ng-change="onChange($index)" aria-label="{{ (pinLabel || \'PIN\') + \' digit \' + ($index + 1) }}" />' +
          '      <span class="otp-mask" aria-hidden="true"><span class="otp-dot"></span></span>' +
          "    </div>" +
          "  </div>" +
          "</div>",
        link: function (scope, element, attrs, ngModelCtrl) {
          const PIN_LENGTH = 4;
          scope.digits = Array.from({ length: PIN_LENGTH }, () => "");

          const getInputs = function () {
            return element[0].querySelectorAll(".binddevice-otp-input");
          };

          const setFocus = function (index) {
            $timeout(function () {
              const inputs = getInputs();
              if (inputs[index]) {
                inputs[index].focus();
                inputs[index].select();
              }
            });
          };

          const normalize = function (value) {
            return (value || "").toString().replace(/\D/g, "").slice(0, PIN_LENGTH);
          };

          const syncModel = function () {
            ngModelCtrl.$setViewValue(scope.digits.join(""));
          };

          ngModelCtrl.$render = function () {
            const pin = normalize(ngModelCtrl.$viewValue);
            for (let i = 0; i < PIN_LENGTH; i += 1) {
              scope.digits[i] = pin[i] || "";
            }
          };

          scope.onChange = function (index) {
            const value = normalize(scope.digits[index]);
            scope.digits[index] = value ? value[value.length - 1] : "";

            if (scope.digits[index] && index < PIN_LENGTH - 1) {
              setFocus(index + 1);
            }

            syncModel();
          };

          scope.onKeydown = function (index, event) {
            if (event.key === "Backspace" || event.key === "Delete") {
              if (index > 0) {
                if (scope.digits[index]) {
                  scope.digits[index] = "";
                } else {
                  scope.digits[index - 1] = "";
                }
                syncModel();
                setFocus(index - 1);
              } else {
                scope.digits[0] = "";
                syncModel();
              }
              event.preventDefault();
              return;
            }

            if (event.key === "ArrowLeft" && index > 0) {
              setFocus(index - 1);
              event.preventDefault();
            }

            if (event.key === "ArrowRight" && index < PIN_LENGTH - 1) {
              setFocus(index + 1);
              event.preventDefault();
            }
          };

          element.on("paste", function (event) {
            const source = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData);
            if (!source) {
              return;
            }
            const pasted = normalize(source.getData("text"));
            if (!pasted) {
              return;
            }
            event.preventDefault();

            for (let i = 0; i < PIN_LENGTH; i += 1) {
              scope.digits[i] = pasted[i] || "";
            }
            scope.$applyAsync(function () {
              syncModel();
              const nextIndex = Math.min(pasted.length, PIN_LENGTH - 1);
              setFocus(nextIndex);
            });
          });
        },
      };
    },
  ]);
})();
