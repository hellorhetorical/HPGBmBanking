(() => {
  "use strict";

  angular.module("hpgbmbanking").factory("SecurityService", [
    "$rootScope",
    "$window",
    function ($rootScope, $window) {
      const MPIN_KEY = "hpgb.security.mpinHash";
      const LEGACY_PASSCODE_KEY = "hpgb.security.passcodeHash";
      const BIOMETRIC_KEY = "hpgb.security.useBiometrics";
      const LAST_UNLOCK_KEY = "hpgb.security.lastUnlockAt";
      const MPIN_KDF_ITERATIONS = 120000;

      const state = {
        ready: false,
        passcodeRecord: null,
        useBiometrics: false,
        lastUnlockAt: 0,
        locked: false,
        intendedPath: null,
      };

      const cap = $window.Capacitor;
      const biometricPlugin =
        cap &&
        cap.Plugins &&
        (cap.Plugins.BiometricAuth || cap.Plugins.Biometric || cap.Plugins.NativeBiometric);
      const secureStore =
        cap && cap.Plugins && (cap.Plugins.SecureStorage || cap.Plugins.SecureStoragePlugin);

      const memoryStore = new Map();
      const storage = {
        get: async (key) => {
          if (secureStore && typeof secureStore.get === "function") {
            const result = await secureStore.get({ key });
            return result && typeof result.value === "string" ? result.value : null;
          }
          return memoryStore.has(key) ? memoryStore.get(key) : null;
        },
        set: async (key, value) => {
          if (secureStore && typeof secureStore.set === "function") {
            await secureStore.set({ key, value: String(value) });
            return;
          }
          memoryStore.set(key, String(value));
        },
      };

      const toHex = (buffer) =>
        Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      const fromHex = (value) => {
        const normalized = (value || "").trim();
        if (!normalized || normalized.length % 2 !== 0) {
          return null;
        }
        const bytes = new Uint8Array(normalized.length / 2);
        for (let i = 0; i < bytes.length; i += 1) {
          bytes[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
        }
        return bytes;
      };

      const normalizePasscode = (value) => (value || "").trim();

      const derivePasscodeRecord = async (value, saltHex, iterations = MPIN_KDF_ITERATIONS) => {
        if (!$window.crypto || !$window.crypto.subtle || !$window.TextEncoder) {
          return null;
        }
        const normalized = normalizePasscode(value);
        const encoder = new $window.TextEncoder();
        const saltBytes = saltHex ? fromHex(saltHex) : $window.crypto.getRandomValues(new Uint8Array(16));
        if (!saltBytes) {
          return null;
        }
        const keyMaterial = await $window.crypto.subtle.importKey(
          "raw",
          encoder.encode(normalized),
          "PBKDF2",
          false,
          ["deriveBits"]
        );
        const bits = await $window.crypto.subtle.deriveBits(
          {
            name: "PBKDF2",
            hash: "SHA-256",
            salt: saltBytes,
            iterations,
          },
          keyMaterial,
          256
        );
        return {
          hash: toHex(bits),
          salt: saltHex || toHex(saltBytes),
          iterations,
        };
      };

      const parsePasscodeRecord = (raw) => {
        if (!raw) {
          return null;
        }
        try {
          const parsed = JSON.parse(raw);
          if (
            parsed &&
            typeof parsed.hash === "string" &&
            typeof parsed.salt === "string" &&
            Number.isFinite(parsed.iterations)
          ) {
            return parsed;
          }
        } catch (error) {
        }
        return {
          hash: String(raw),
          salt: null,
          iterations: 0,
          legacy: true,
        };
      };

      const migrateLegacyItem = async (key) => {
        return null;
      };

      const loadState = async () => {
        if (state.ready) {
          return;
        }
        let rawPasscode = await storage.get(MPIN_KEY);
        if (!rawPasscode) {
          rawPasscode = await storage.get(LEGACY_PASSCODE_KEY);
        }
        if (!rawPasscode) {
          rawPasscode = await migrateLegacyItem(MPIN_KEY);
        }
        state.passcodeRecord = parsePasscodeRecord(rawPasscode);
        let rawBiometrics = await storage.get(BIOMETRIC_KEY);
        if (!rawBiometrics) {
          rawBiometrics = await migrateLegacyItem(BIOMETRIC_KEY);
        }
        state.useBiometrics = rawBiometrics === "true";
        const lastUnlock = memoryStore.get(LAST_UNLOCK_KEY);
        state.lastUnlockAt = lastUnlock ? Number(lastUnlock) : 0;
        state.locked = shouldLock();
        state.ready = true;
      };

      const shouldLock = () => {
        if (!state.passcodeRecord) {
          return false;
        }
        if (state.locked) {
          return true;
        }
        if (!state.lastUnlockAt) {
          return true;
        }
        return false;
      };

      const markUnlocked = () => {
        state.locked = false;
        state.lastUnlockAt = Date.now();
        memoryStore.set(LAST_UNLOCK_KEY, String(state.lastUnlockAt));
      };

      const lockNow = () => {
        if (!state.passcodeRecord) {
          return;
        }
        state.locked = true;
      };

      const appShortName =
        (window.HPGB_APP && window.HPGB_APP.BANK_SHORT_NAME) || "bankshortname";
      const appTitle =
        (window.HPGB_APP && window.HPGB_APP.APP_TITLE) || `${appShortName} mBanking`;

      const authenticateBiometrics = async () => {
        if (!biometricPlugin) {
          throw new Error("Biometrics not available on this device.");
        }
        if (typeof biometricPlugin.verifyIdentity === "function") {
          await biometricPlugin.verifyIdentity({
            reason: `Unlock ${appTitle}`,
            title: "Unlock",
          });
          return;
        }
        if (typeof biometricPlugin.authenticate === "function") {
          await biometricPlugin.authenticate({
            reason: `Unlock ${appTitle}`,
          });
          return;
        }
        throw new Error("Biometrics not available on this device.");
      };

      return {
        ensureReady: async () => {
          await loadState();
        },
        markUnlocked: () => {
          markUnlocked();
        },
        hasMpin: () => !!state.passcodeRecord,
        isPasscodeSet: () => !!state.passcodeRecord,
        getPasscodeStatus: () => (state.passcodeRecord ? "MPIN set" : "MPIN not set"),
        setMpin: async (value) => {
          const record = await derivePasscodeRecord(value);
          if (!record) {
            throw new Error("Secure MPIN storage is unavailable on this device.");
          }
          await storage.set(MPIN_KEY, JSON.stringify(record));
          state.passcodeRecord = record;
          markUnlocked();
        },
        verifyMpin: async (value) => {
          if (!state.passcodeRecord) {
            return false;
          }
          if (state.passcodeRecord.legacy) {
            const normalized = normalizePasscode(value);
            if ($window.crypto && $window.crypto.subtle && $window.TextEncoder) {
              const data = new $window.TextEncoder().encode(normalized);
              const hash = await $window.crypto.subtle.digest("SHA-256", data);
              const hex = toHex(hash);
              if (hex === state.passcodeRecord.hash) {
                const record = await derivePasscodeRecord(normalized);
                if (!record) {
                  return false;
                }
                await storage.set(MPIN_KEY, JSON.stringify(record));
                state.passcodeRecord = record;
                markUnlocked();
                return true;
              }
            }
            return false;
          }
          const record = await derivePasscodeRecord(
            value,
            state.passcodeRecord.salt,
            state.passcodeRecord.iterations
          );
          if (record && record.hash === state.passcodeRecord.hash) {
            markUnlocked();
            return true;
          }
          return false;
        },
        isBiometricsEnabled: () => state.useBiometrics,
        setPasscode: async (value) => {
          const record = await derivePasscodeRecord(value);
          if (!record) {
            throw new Error("Secure MPIN storage is unavailable on this device.");
          }
          await storage.set(MPIN_KEY, JSON.stringify(record));
          state.passcodeRecord = record;
          markUnlocked();
        },
        verifyPasscode: async (value) => {
          if (!state.passcodeRecord) {
            return false;
          }
          if (state.passcodeRecord.legacy) {
            const normalized = normalizePasscode(value);
            if ($window.crypto && $window.crypto.subtle && $window.TextEncoder) {
              const data = new $window.TextEncoder().encode(normalized);
              const hash = await $window.crypto.subtle.digest("SHA-256", data);
              const hex = toHex(hash);
              if (hex === state.passcodeRecord.hash) {
                const record = await derivePasscodeRecord(normalized);
                if (!record) {
                  return false;
                }
                await storage.set(MPIN_KEY, JSON.stringify(record));
                state.passcodeRecord = record;
                markUnlocked();
                return true;
              }
            }
            return false;
          }
          const record = await derivePasscodeRecord(
            value,
            state.passcodeRecord.salt,
            state.passcodeRecord.iterations
          );
          if (record && record.hash === state.passcodeRecord.hash) {
            markUnlocked();
            return true;
          }
          return false;
        },
        setBiometricsEnabled: async (value) => {
          state.useBiometrics = !!value;
          await storage.set(BIOMETRIC_KEY, state.useBiometrics ? "true" : "false");
        },
        tryBiometricUnlock: async () => {
          await authenticateBiometrics();
          markUnlocked();
        },
        shouldLock: shouldLock,
        lock: lockNow,
        setIntendedPath: (path) => {
          state.intendedPath = path;
        },
        consumeIntendedPath: () => {
          const path = state.intendedPath;
          state.intendedPath = null;
          return path;
        },
      };
    },
  ]);
})();
