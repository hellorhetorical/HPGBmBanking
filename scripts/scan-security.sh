#!/usr/bin/env sh
set -eu

USE_RG=0
if command -v rg >/dev/null 2>&1; then
  USE_RG=1
fi

search() {
  pattern="$1"
  if [ "$USE_RG" -eq 1 ]; then
    rg -n "$pattern" src --glob "!src/vendor/**"
  else
    grep -R -n -E "$pattern" src --exclude-dir vendor
  fi
}

search_urls() {
  pattern="$1"
  if [ "$USE_RG" -eq 1 ]; then
    rg -n "$pattern" src --glob "!src/vendor/**" --glob "!src/licenses/**" --glob "!src/views/license.html" --glob "!src/app-config.js"
  else
    grep -R -n -E "$pattern" src --exclude-dir vendor --exclude-dir licenses --exclude "license.html" --exclude "app-config.js"
  fi
}

fail_on_output() {
  output="$1"
  label="$2"
  if [ -n "$output" ]; then
    printf "%s\n" "$label"
    printf "%s\n" "$output"
    exit 1
  fi
}

output="$(search '(eval\(|Function\(|innerHTML|outerHTML|document\.write|new\s+Function|srcdoc)')" || true
fail_on_output "$output" "Potential unsafe DOM/eval usage found:"

output="$(search '(localStorage|sessionStorage|indexedDB|cookie)')" || true
fail_on_output "$output" "Storage usage found:"

output="$(search '(ng-bind-html|ng-include|\$sce\.trustAs)')" || true
fail_on_output "$output" "Potential unsafe AngularJS bindings found:"

if [ "$USE_RG" -eq 1 ]; then
  output="$(rg -n 'target="_blank"' src --glob "!src/vendor/**" | rg -n -v 'rel="noopener noreferrer"')" || true
else
  output="$(grep -R -n -E 'target="_blank"' src --exclude-dir vendor | grep -v -E 'rel="noopener noreferrer"')" || true
fi
fail_on_output "$output" "target=\"_blank\" without rel=\"noopener noreferrer\" found:"

output="$(search_urls 'https?://')" || true
fail_on_output "$output" "Hardcoded external URLs found outside app-config.js:"

node scripts/validate-external-urls.js

printf "%s\n" "Note: Dynamic HTML rendering is disallowed (ng-bind-html, \$sce.trustAs*, ng-include)."
