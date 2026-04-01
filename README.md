# HPGBmBanking

AngularJS + Capacitor blank canvas for the HPGBmBanking mobile app.

## Prerequisites
- Node.js 18+ with npm
- Android Studio + SDK (for Android builds)

## Setup
```sh
npm install
npm run setup:web
```

## Build web assets
```sh
npm run build
```

## Add Android platform
```sh
npx cap init "HPGBmBanking" "com.hpgbmbanking.app" --web-dir www
npm run cap:android
```

## Sync after changes
```sh
npm run cap:sync
```

## Deployment hardening checklist (non-local use)
- Migrate off AngularJS 1.x or document the accepted risk (known XSS/ReDoS advisories with no fix).
- Disable demo mode and remove mock data/credentials from production bundles.
- Enforce secure storage for secrets (no sessionStorage/localStorage fallback for passcode/biometric flags).
- Add passcode brute-force protections (attempt limits, exponential backoff, wipe/lockout policy).
- Review CSP for any external endpoints and keep `script-src` locked to trusted sources only.
- Add runtime logging/telemetry for auth and security events (lock/unlock, failures).
# HPGBmBanking
