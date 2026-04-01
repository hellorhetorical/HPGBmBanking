(() => {
  "use strict";
  angular.module("hpgbmbanking").config([
      "$routeProvider",
      "$compileProvider",
      function ($routeProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https|mailto|tel):/i);
        $routeProvider
          .when("/", {
            templateUrl: "views/overview.html",
            controller: "OverviewController",
            controllerAs: "vm",
          })
          .when("/terms", {
            templateUrl: "views/terms.html",
            controller: "TermsController",
            controllerAs: "vm",
          })
          .when("/home", {
            templateUrl: "views/home.html",
            controller: "HomeController",
            controllerAs: "vm",
          })
          .when("/search", {
            templateUrl: "views/search.html",
            controller: "SearchController",
            controllerAs: "vm",
          })
          .when("/accounts", {
            templateUrl: "views/accounts.html",
            controller: "AccountsController",
            controllerAs: "vm",
          })
          .when("/activity", {
            templateUrl: "views/activity.html",
            controller: "ActivityController",
            controllerAs: "vm",
          })
          .when("/settings", {
            templateUrl: "views/settings.html",
            controller: "SettingsController",
            controllerAs: "vm",
          })
          .when("/settings/security", {
            redirectTo: "/settings",
          })
          .when("/settings/profile", {
            templateUrl: "views/profile.html",
            controller: "ProfileController",
            controllerAs: "vm",
          })
          .when("/settings/profile/sign-on", {
            templateUrl: "views/sign-on-password.html",
            controller: "SignOnPasswordController",
            controllerAs: "vm",
          })
          .when("/settings/profile/transaction", {
            templateUrl: "views/transaction-password.html",
            controller: "TransactionPasswordController",
            controllerAs: "vm",
          })
          .when("/settings/profile/sms", {
            templateUrl: "views/sms-password.html",
            controller: "SmsPasswordController",
            controllerAs: "vm",
          })
          .when("/settings/notifications", {
            templateUrl: "views/notifications.html",
            controller: "NotificationsController",
            controllerAs: "vm",
          })
          .when("/lock", {
            templateUrl: "views/lock.html",
            controller: "LockController",
            controllerAs: "vm",
          })
          .when("/support", {
            templateUrl: "views/support.html",
            controller: "SupportController",
            controllerAs: "vm",
          })
          .when("/more", {
            templateUrl: "views/more.html",
            controller: "MoreController",
            controllerAs: "vm",
          })
          .when("/socialmedia", {
            templateUrl: "views/socialmedia.html",
            controller: "SocialMediaController",
            controllerAs: "vm",
          })
          .when("/loans", {
            templateUrl: "views/loans.html",
            controller: "LoansController",
            controllerAs: "vm",
          })
          .when("/calculator", {
            templateUrl: "views/calculator.html",
            controller: "CalculatorController",
            controllerAs: "vm",
          })
          .when("/initiatetransfer", {
            templateUrl: "views/initiatetranfer.html",
            controller: "InitiateTransferController",
            controllerAs: "vm",
          })
          .when("/transfer-status", {
            templateUrl: "views/transfer-status.html",
            controller: "TransferStatusController",
            controllerAs: "vm",
          })
          .when("/transfer-otp", {
            templateUrl: "views/transfer-otp.html",
            controller: "TransferOtpController",
            controllerAs: "vm",
          })
          .when("/beneficiaries", {
            templateUrl: "views/beneficiaries.html",
            controller: "BeneficiariesController",
            controllerAs: "vm",
          })
          .when("/beneficiaries/add", {
            templateUrl: "views/beneficiary-add.html",
            controller: "BeneficiaryAddController",
            controllerAs: "vm",
          })
          .when("/beneficiaries/confirm", {
            templateUrl: "views/beneficiary-confirm.html",
            controller: "BeneficiaryConfirmController",
            controllerAs: "vm",
          })
          .when("/beneficiaries/status", {
            templateUrl: "views/beneficiary-status.html",
            controller: "BeneficiaryStatusController",
            controllerAs: "vm",
          })
          .when("/quickpay", {
            templateUrl: "views/quickpay.html",
            controller: "QuickPayController",
            controllerAs: "vm",
          })
          .when("/quickpay-otp", {
            templateUrl: "views/quickpay-otp.html",
            controller: "QuickPayOtpController",
            controllerAs: "vm",
          })
          .when("/quickpay-status", {
            templateUrl: "views/quickpay-status.html",
            controller: "QuickPayStatusController",
            controllerAs: "vm",
          })
          .when("/account-view", {
            templateUrl: "views/account-view.html",
            controller: "AccountViewController",
            controllerAs: "vm",
          })
          .when("/account-statement", {
            templateUrl: "views/account-statement.html",
            controller: "AccountStatementController",
            controllerAs: "vm",
          })
          .when("/hostlist-debit-card", {
            templateUrl: "views/hostlist-debit-card.html",
            controller: "HostlistDebitCardController",
            controllerAs: "vm",
          })
          .when("/generate-green-pin", {
            templateUrl: "views/generate-green-pin.html",
            controller: "GenerateGreenPinController",
            controllerAs: "vm",
          })
          .when("/card-management", {
            templateUrl: "views/card-management.html",
            controller: "CardManagementController",
            controllerAs: "vm",
          })
          .when("/limit-management", {
            templateUrl: "views/limit-management.html",
            controller: "LimitManagementController",
            controllerAs: "vm",
          })
          .when("/limit-atm", {
            templateUrl: "views/limit-atm.html",
            controller: "LimitAtmController",
            controllerAs: "vm",
          })
          .when("/limit-pos", {
            templateUrl: "views/limit-pos.html",
            controller: "LimitPosController",
            controllerAs: "vm",
          })
          .when("/limit-ecomm", {
            templateUrl: "views/limit-ecomm.html",
            controller: "LimitEcommController",
            controllerAs: "vm",
          })
          .when("/limit-contactless", {
            templateUrl: "views/limit-contactless.html",
            controller: "LimitContactlessController",
            controllerAs: "vm",
          })
          .when("/open-rd", {
            templateUrl: "views/open-rd.html",
            controller: "OpenRdController",
            controllerAs: "vm",
          })
          .when("/open-fd", {
            templateUrl: "views/open-fd.html",
            controller: "OpenFdController",
            controllerAs: "vm",
          })
          .when("/fd-closure", {
            templateUrl: "views/fd-closure.html",
            controller: "FdClosureController",
            controllerAs: "vm",
          })
          .when("/track-fd-status", {
            templateUrl: "views/track-fd-status.html",
            controller: "TrackFdStatusController",
            controllerAs: "vm",
          })
          .when("/track-rd-status", {
            templateUrl: "views/track-rd-status.html",
            controller: "TrackRdStatusController",
            controllerAs: "vm",
          })
          .when("/deposit-management", {
            templateUrl: "views/deposit-management-more.html",
            controller: "DepositManagementMoreController",
            controllerAs: "vm",
          })
          .when("/mpassbook", {
            templateUrl: "views/mpassbook.html",
            controller: "MPassbookController",
            controllerAs: "vm",
          })
          .when("/pmjjby", {
            templateUrl: "views/pmjjby.html",
            controller: "PmjjbyController",
            controllerAs: "vm",
          })
          .when("/pmsby", {
            templateUrl: "views/pmsby.html",
            controller: "PmsbyController",
            controllerAs: "vm",
          })
          .when("/apy", {
            templateUrl: "views/apy.html",
            controller: "ApyController",
            controllerAs: "vm",
          })
          .when("/inquire-cheque", {
            templateUrl: "views/inquire-cheque.html",
            controller: "InquireChequeController",
            controllerAs: "vm",
          })
          .when("/stop-cheque", {
            templateUrl: "views/stop-cheque.html",
            controller: "StopChequeController",
            controllerAs: "vm",
          })
          .when("/view-cheque", {
            templateUrl: "views/view-cheque.html",
            controller: "ViewChequeController",
            controllerAs: "vm",
          })
          .when("/pps", {
            templateUrl: "views/pps.html",
            controller: "PpsController",
            controllerAs: "vm",
          })
          .when("/form-15gh", {
            templateUrl: "views/form-15gh.html",
            controller: "Form15ghController",
            controllerAs: "vm",
          })
          .when("/form-26as", {
            templateUrl: "views/form-26as.html",
            controller: "Form26asController",
            controllerAs: "vm",
          })
          .when("/ckyc", {
            templateUrl: "views/ckyc.html",
            controller: "CkycController",
            controllerAs: "vm",
          })
          .when("/mobile-recharge", {
            templateUrl: "views/mobile-recharge.html",
            controller: "MobileRechargeController",
            controllerAs: "vm",
          })
          .when("/dth-recharge", {
            templateUrl: "views/dth-recharge.html",
            controller: "DthRechargeController",
            controllerAs: "vm",
          })
          .when("/bill-payment", {
            templateUrl: "views/bill-payment.html",
            controller: "BillPaymentController",
            controllerAs: "vm",
          })
          .when("/bbps", {
            templateUrl: "views/bbps.html",
            controller: "BbpsController",
            controllerAs: "vm",
          })
          .when("/account-details", {
            templateUrl: "views/account-details.html",
            controller: "AccountDetailsController",
            controllerAs: "vm",
          })
          .when("/year-wise-statement", {
            templateUrl: "views/year-wise-statement.html",
            controller: "YearWiseStatementController",
            controllerAs: "vm",
          })
          .when("/mini-statement", {
            templateUrl: "views/mini-statement.html",
            controller: "MiniStatementController",
            controllerAs: "vm",
          })
          .when("/binddevice", {
            templateUrl: "views/binddevice.html",
            controller: "BindDeviceController",
            controllerAs: "vm",
          })
          .when("/forgot/:flow", {
            templateUrl: "views/forgot-userid.html",
            controller: "ForgotUserIdController",
            controllerAs: "vm",
          })
          .when("/forgot-otp", {
            templateUrl: "views/forgot-otp.html",
            controller: "ForgotOtpController",
            controllerAs: "vm",
          })
          .when("/forgot-card", {
            templateUrl: "views/forgot-card.html",
            controller: "ForgotCardController",
            controllerAs: "vm",
          })
          .when("/forgot-reset", {
            templateUrl: "views/forgot-reset.html",
            controller: "ForgotResetController",
            controllerAs: "vm",
          })
          .when("/otp", {
            templateUrl: "views/otp.html",
            controller: "OtpController",
            controllerAs: "vm",
          })
          .when("/new-user", {
            templateUrl: "views/new-user.html",
            controller: "NewUserController",
            controllerAs: "vm",
          })
          .when("/new-user-otp", {
            templateUrl: "views/new-user-otp.html",
            controller: "NewUserOtpController",
            controllerAs: "vm",
          })
          .when("/new-user-mpin", {
            templateUrl: "views/new-user-mpin.html",
            controller: "NewUserMpinController",
            controllerAs: "vm",
          })
          .when("/new-user-success", {
            templateUrl: "views/new-user-success.html",
            controller: "NewUserSuccessController",
            controllerAs: "vm",
          })
          .when("/first-login", {
            templateUrl: "views/first-login-setup.html",
            controller: "FirstLoginSetupController",
            controllerAs: "vm",
          })
          .when("/first-login-otp", {
            templateUrl: "views/first-login-otp.html",
            controller: "FirstLoginOtpController",
            controllerAs: "vm",
          })
          .when("/emi", {
            templateUrl: "views/emi.html",
            controller: "EmiController",
            controllerAs: "vm",
          })
          .when("/emimoratorium", {
            templateUrl: "views/emimoratorium.html",
            controller: "EmiMoratoriumController",
            controllerAs: "vm",
          })
          .when("/interest", {
            templateUrl: "views/interest.html",
            controller: "InterestController",
            controllerAs: "vm",
          })
          .when("/rd", {
            templateUrl: "views/rd.html",
            controller: "RdController",
            controllerAs: "vm",
          })
          .when("/fd", {
            templateUrl: "views/fd.html",
            controller: "FdController",
            controllerAs: "vm",
          })
          .when("/updates", {
            templateUrl: "views/updates.html",
            controller: "UpdatesController",
            controllerAs: "vm",
          })
          .when("/faq", {
            templateUrl: "views/faq.html",
            controller: "FaqController",
            controllerAs: "vm",
          })
          .when("/license", {
            templateUrl: "views/license.html",
            controller: "LicenseController",
            controllerAs: "vm",
          })
          .otherwise({
            redirectTo: "/",
          });
      },
    ]);
})();
