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
3. Trigger a deployment.

Add the Firebase web app values to Vercel environment variables. If they are missing or incorrect, the quiz route will fail loudly instead of silently using local data.

The app includes `vercel.json` and exports the Express app from `server.js`, so no extra build setup is needed.

## Notes

- `/health` returns `{ "ok": true }` for quick uptime checks.
- Data loading now depends on Firestore only.
- `firebaseAdmin.js` is only needed for the one-time CSV upload script. The deployed app does not depend on a service account.
- Quiz state is currently kept in-memory on the server. This is fine for initial testing, but for production multiplayer reliability you should move game state to a persistent store per user/session.

## Secure Firestore Rules

Use the rules in `firestore.rules` to allow public read access to the `animals` collection and block all writes.

Publish with Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

Or paste the same rules into Firebase Console -> Firestore Database -> Rules.

## Vercel Troubleshooting

If you see `Could not start quiz...`:

1. Open `/health` and check `animalsLoaded` and `dataSource`.
2. If `dataSource` is `firestore`, confirm your Firestore `animals` collection contains at least 5 records and the public read rules are deployed.
3. If `lastDataLoadError` is set, fix the Firebase environment variables or Firestore access.
