# Contributing to VazhipaduBook

Thank you for helping improve VazhipaduBook!

## Development Workflow

1. Fork the repository and create a feature branch from `main`.
2. Copy the configuration templates (never commit real `.env` or `firebase-applet-config.json` files):
   ```bash
   cp .env.example .env
   cp firebase-applet-config.example.json firebase-applet-config.json
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Verify all checks pass before opening a pull request:
   ```bash
   npm run lint
   npx eslint firestore.rules
   npm run build
   ```

## Security & Privacy Rules for Contributors

- **Never commit plaintext secrets:** Double-check `git status` and `git diff` to ensure `.env`, `firebase-applet-config.json`, service account JSONs, or private keys are never staged.
- **Encrypt sensitive local data:** Any browser-persisted devotee details or offline caches must use `src/utils/secureStorage.ts` rather than raw `localStorage`.
- **Keep Firestore rules synchronized:** Any change to `BookingRecord` or `UserProfile` fields must be reflected in `firebase-blueprint.json`, `firestore.rules`, and verified with `npx eslint firestore.rules`.
