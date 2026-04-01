# Security

## Risk Acceptance: AngularJS 1.8.3 Dependency

### Summary
This application uses AngularJS 1.8.3, which has known high-severity XSS/ReDoS vulnerabilities
with no available upstream fix.

### Risk
If user-controlled input reaches unsafe sinks or trusted HTML contexts, an attacker could achieve
XSS or resource exhaustion. This is a runtime risk in any deployed build.

### Current Mitigations
- Strict CSP in `src/index.html` (no inline scripts; no inline styles).
- No app-authored usage of `ng-bind-html`, `innerHTML`, `eval`, or `Function`.
- External links are controlled via config values and `ng-href`.
- CI checks block reintroduction of unsafe patterns.

### UI HTML Policy (Enforced)
- Dynamic HTML rendering is disallowed (no `ng-bind-html`, `$sce.trustAs*`, or `ng-include`).
- Any future need for rich HTML must be approved and use a sanitizer with a strict allowlist.

### Residual Risk
AngularJS itself remains vulnerable; risk is reduced but not eliminated. This is accepted for the
current UI-only scope. Any public or production deployment increases exposure.

### Acceptance Decision
We accept this risk temporarily due to legacy architecture and UI-only scope.

### Review / Revisit
- Reassess on any production deployment.
- Target migration away from AngularJS 1.x.
- Review every quarter or upon major feature expansion.
