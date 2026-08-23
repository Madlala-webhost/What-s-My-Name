# What's My Name Game

Animal quiz game built with Express, EJS templates, and Firestore.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy env template and fill in Firebase values:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm run dev
```

4. Open http://localhost:3000

## Deploy To Vercel

1. Push your repo to GitHub.
2. Import the project in Vercel.
3. In Vercel Project Settings -> Environment Variables, add:
   - FIREBASE_PROJECT_ID
   - FIREBASE_SERVICE_ACCOUNT_JSON

   `FIREBASE_SERVICE_ACCOUNT_JSON` must be the full JSON object from your Firebase service account key, on one line.
4. Trigger a deployment.

The app includes `vercel.json` and exports the Express app from `server.js`, so no extra build setup is needed.

## Notes

- `/health` returns `{ "ok": true }` for quick uptime checks.
- Data loading now tries Firestore first, then falls back to `animals.txt` if Firestore is unavailable.
- Quiz state is currently kept in-memory on the server. This is fine for initial testing, but for production multiplayer reliability you should move game state to a persistent store per user/session.

## Secure Firestore Rules

Use the rules in `firestore.rules` to block all client SDK access and allow backend-only access via Firebase Admin SDK.

Publish with Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

Or paste the same rules into Firebase Console -> Firestore Database -> Rules.

## Vercel Troubleshooting

If you see `Could not start quiz...`:

1. Open `/health` and check `animalsLoaded` and `dataSource`.
2. If `dataSource` is `local-file`, your Firebase Admin credentials are missing/invalid.
3. Verify `FIREBASE_SERVICE_ACCOUNT_JSON` and `FIREBASE_PROJECT_ID` are set in Vercel exactly as listed above.
4. Confirm your Firestore `animals` collection contains at least 5 records.
