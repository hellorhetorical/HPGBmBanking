(() => {
  "use strict";

  const { MOCK_DATA, DEFAULT_USER, readSession } = window.HPGB_APP || {};

  angular.module("hpgbmbanking").controller("NotificationsController", [
    "$window",
    function ($window) {
      const vm = this;
      const mockUsers = (MOCK_DATA && MOCK_DATA.MOCK_USERS) || [];
      const session = readSession ? readSession() : null;
      const sessionUserId =
        session && session.user && session.user.userId ? session.user.userId : "";
      const fallbackUserId = DEFAULT_USER && DEFAULT_USER.userId ? DEFAULT_USER.userId : "";
      const activeUserId = sessionUserId || fallbackUserId;
      const activeUser =
        Array.isArray(mockUsers) && activeUserId
          ? mockUsers.find((user) => user.userId === activeUserId)
          : null;

      vm.title = "Notifications";
      vm.subtitle = "Stay informed with account alerts and updates.";
      const rawNotes = (activeUser && activeUser.notifications) || [];
      vm.notifications = rawNotes.map((note) => ({
        ...note,
        isUnread: note && note.read === false,
      }));
    },
  ]);
})();
