# VazhipaduBook — Palakkad Temple Pooja & Prasadam Booking Platform

An installable Progressive Web App (PWA) for discovering and booking authentic Kerala temple *Vazhipadus*, *Archana*, *Abhishekam*, *Payasam*, and *Special Homam* offerings across heritage temples in **Palakkad, Kerala**.

---

## Featured Palakkad Temples

1. **Kalpathy Sri Viswanatha Swamy Temple** (*Heritage Village, Kalpathy*) — Lord Shiva
2. **Manapullikavu Bhagavathy Temple** (*Kallikad, Palakkad*) — Goddess Bhagavathy
3. **Sree Emoor Bhagavathy Temple (Hemambika Temple)** (*Kallekulangara, Palakkad*) — Goddess Hemambika
4. **Thiruvalathur Randu Moorthy Temple** (*Kodumbu, Palakkad*) — Mahishasuramardini & Annapoorneswari

---

## Key Features

- **Temple Discovery & Live Darshan Status:** Filter across Palakkad temples by deity or offering category (*All, Bhagavathy, Shiva, Homam, Nivedyam*) with live IST darshan status (`Open Now` / `Closed`).
- **Authentic Kerala Sankalpam Booking:** Capture devotee name, all **27 Malayalam Nakshatras** (*Ashwathi* to *Revathi*), pooja date, and Prasadam delivery option (*Temple Counter Pickup* or *Speed Post +₹50*).
- **Digital E-Vazhipadu Tickets (QR Receipts):** Cloud-synced receipts (`PKD-YYYY-XXXX`) with QR verification, printable PDF view, and downloadable text receipt.
- **Consumer-Only Previous-Day Cancellation:** Devotees can cancel their own active bookings up to **11:59 PM IST the day prior** to the scheduled pooja. Cancelled bookings are separated into a dedicated **Cancelled** tab.
- **Google Authentication & Cloud Firestore:** One-click Google Sign-In with hardened Firestore Security Rules (`firestore.rules`) and strict owner-only PII isolation.
- **Installable PWA & Offline Support:** Includes a Web App Manifest, Service Worker caching (`vite-plugin-pwa`), Android/iOS home-screen icons, and an **Install App** button in the header.
- **Encrypted Local Storage & Secrets Tooling:**
  - Client-side browser cache (cart offerings & offline tickets) is encrypted using **Web Crypto AES-256-GCM** with a non-extractable key in IndexedDB (`src/utils/secureStorage.ts`).
  - Repository configuration encryption CLI (`npm run secrets:encrypt` / `npm run secrets:decrypt`) protects sensitive `.env` and `firebase-applet-config.json` files using **AES-256-GCM + scrypt**.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, `qrcode.react`
- **Backend & Auth:** Firebase Authentication (Google), Cloud Firestore, Firestore Security Rules
- **PWA:** `vite-plugin-pwa` + Workbox
- **Security Tooling:** Web Crypto API (`AES-GCM`), Node `crypto` (`scrypt` + `aes-256-gcm`), `@firebase/eslint-plugin-security-rules`

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd vazhipadubook
npm install
```

### 2. Configure Firebase & Environment Variables

Plaintext config files (`.env`, `firebase-applet-config.json`) are excluded by `.gitignore` and never committed. Choose either option:

**Option A — Decrypt an existing encrypted secrets archive (if provided by your team):**

```bash
npm run secrets:decrypt
```

**Option B — Configure manually from templates:**

```bash
cp .env.example .env
cp firebase-applet-config.example.json firebase-applet-config.json
```

Fill in your Firebase project values in `firebase-applet-config.json` (or via `VITE_FIREBASE_*` environment variables in `.env`).

### 3. Run Locally

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Keeping Sensitive Data Encrypted

1. **Never commit plaintext secrets:** `.gitignore` ignores `.env*`, `firebase-applet-config.json`, `*.pem`, `*.key`, and `*serviceAccount*.json`.
2. **Encrypt config before backing up or sharing:**
   ```bash
   npm run secrets:encrypt
   ```
   This bundles local config files into `.secrets.enc.json` using **AES-256-GCM** with a **scrypt**-derived key and random salt/IV. Share the passphrase securely out-of-band (never commit passphrases).
3. **Browser storage encryption:** Devotee names, birth stars, phone numbers, and offline tickets cached locally are encrypted via **AES-256-GCM** (`src/utils/secureStorage.ts`) bound to the signed-in user's UID.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server on port 3000 (with PWA dev worker enabled) |
| `npm run build` | Build production bundle and service worker into `dist/` |
| `npm run lint` | Run TypeScript typechecking (`tsc --noEmit`) |
| `npx eslint firestore.rules` | Audit Firestore security rules against security lint rules |
| `npm run secrets:encrypt` | Encrypt local `.env` / `firebase-applet-config.json` with AES-256-GCM |
| `npm run secrets:decrypt` | Decrypt `.secrets.enc.json` back to local config files |

---

## Open-License Temple Photo Credits

- **Kalpathy Sri Viswanatha Swamy Temple:** Wikimedia Commons (`Itsn4kul10`, CC BY-SA 4.0)
- **Manapullikavu Bhagavathy Temple:** Wikimedia Commons (`Thiruvilla`, Public Domain)
- **Sree Emoor Bhagavathy Temple:** Openverse / Flickr (`P Radhika`, CC BY-SA 2.0)
- **Thiruvalathur Randu Moorthy Temple:** Wikimedia Commons / British Library 1900 (Public Domain)

---

## License

Released under the [MIT License](./LICENSE).
