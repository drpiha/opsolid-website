# .well-known — Universal Links (TODO: Faz 7.1)

This directory will host the OS-level deep-link verification files once the
standalone mobile build exists and the signing credentials are known.

## Files needed

### iOS — apple-app-site-association (no extension, served as application/json)

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TODO_APPLE_TEAM_ID.de.opsolid.mobile",
        "paths": ["/auth/verify*"]
      }
    ]
  }
}
```

Requires: Apple Developer Team ID (obtained after Apple Developer account purchase).
Next.js serves this automatically via the `public/` directory — no custom route needed.

### Android — assetlinks.json

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "de.opsolid.mobile",
      "sha256_cert_fingerprints": ["TODO_SHA256_AFTER_FIRST_STANDALONE_BUILD"]
    }
  }
]
```

Requires: SHA-256 fingerprint of the Android signing keystore.
Run after first EAS build: `eas credentials` → copy the SHA-256.

## Current state (Faz 7.0b)

MVP uses `opsolid://` custom scheme deep-links (not Universal Links).
- No OS verification files needed for custom schemes.
- Android: "no app handles this link" if app not installed — acceptable.
- iOS: same fallback.

## When to activate (Faz 7.1)

1. EAS standalone build produces signing credentials.
2. Fill in TEAM_ID and SHA256 in the files above.
3. Remove this README (or keep for docs).
4. Verify with: `curl https://opsolid.de/.well-known/apple-app-site-association`
   and `curl https://opsolid.de/.well-known/assetlinks.json`
