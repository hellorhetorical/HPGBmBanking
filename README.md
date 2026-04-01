# HPGBmBanking

Mobile banking app shell built with AngularJS (1.x) and Capacitor.

## Prerequisites
- Node.js 18+
- npm 9+
- Android Studio + Android SDK (for Android builds)

## Quick Start
```sh
npm install
npm run setup:web
npm run build
```

Build artifacts are generated in `www/`.

## Build Modes
- `npm run build`: Demo build (`--demo`) including mock data/config.
- `npm run build:prod`: Production-style build (no demo mock injection).
- `npm run build:raw`: Direct copy of `src/` to `www/` (no bundling/template cache/SRI).

## Capacitor / Android
If Android platform is not added yet:
```sh
npx cap init "HPGBmBanking" "com.hpgbmbanking.app" --web-dir www
npm run cap:android
```

After any web code changes:
```sh
npm run cap:sync
```

## Security / Quality Checks
```sh
npm run scan:security
```

## Project Layout
- `src/`: App source (views, controllers, services, styles, assets)
- `scripts/build.js`: Bundles JS/CSS, preloads view templates, injects SRI + cache-busting
- `www/`: Generated web bundle used by Capacitor
- `android/`: Native Android project

## Deployment Hardening Checklist
- Migrate off AngularJS 1.x or formally accept known ecosystem risk.
- Disable demo mode and remove mock credentials/data from production bundles.
- Enforce secure secret storage (avoid browser storage fallback for auth flags).
- Add passcode brute-force controls (attempt limits, backoff, lockout/wipe policy).
- Keep CSP strict and limited to trusted endpoints/sources.
- Add runtime telemetry for auth/security events.
