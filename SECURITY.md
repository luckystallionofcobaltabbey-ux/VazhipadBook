# Security Policy

## Data Protection & Encryption Architecture

VazhipaduBook applies layered safeguards for devotee personally identifiable information (PII) and application configuration:

1. **Transport & Cloud Storage Encryption:**
   - All client communication with Firebase Authentication and Cloud Firestore is encrypted in transit over HTTPS/TLS.
   - Cloud Firestore encrypts all persisted user profiles and booking documents at rest.

2. **Client-Side Local Storage Encryption (`src/utils/secureStorage.ts`):**
   - Browser-persisted cart offerings (devotee names, Nakshatras) and offline E-Vazhipadu ticket caches are encrypted with **Web Crypto API AES-256-GCM** using a random 96-bit IV per write and a **non-extractable `CryptoKey`** stored in IndexedDB.
   - Cached booking records bind Additional Authenticated Data (AAD) to the authenticated user's UID and are cleared immediately on sign-out.

3. **Repository & Secrets Hygiene (`scripts/secrets-crypto.mjs`):**
   - `.gitignore` excludes `.env*`, `firebase-applet-config.json`, private keys (`*.pem`, `*.key`, `*.p12`), and Firebase Admin service accounts.
   - Local environment and Firebase configs can be encrypted with **AES-256-GCM + scrypt** (`npm run secrets:encrypt`) into `.secrets.enc.json` for safe backup without exposing plaintext credentials.

4. **Firestore Access Controls (`firestore.rules`):**
   - Master default-deny rule blocks all unspecified paths.
   - Strict schema validation (`keys().hasAll` / `keys().hasOnly`), string bounds, and arithmetic integrity checks on every booking write.
   - Cancellations are restricted exclusively to the authenticated booking owner (`existing().userId == request.auth.uid`) prior to `cancellationDeadline` (`request.time <= existing().cancellationDeadline`).
   - Audited via `@firebase/eslint-plugin-security-rules` in CI.

## Reporting a Vulnerability

If you discover a security issue, **please do not open a public GitHub issue** with exploit details or exposed credentials. Instead, contact the repository maintainer privately via GitHub Security Advisories or private direct message with steps to reproduce.
