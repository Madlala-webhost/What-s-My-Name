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
   - FIREBASE_API_KEY
   - FIREBASE_AUTH_DOMAIN
   - FIREBASE_PROJECT_ID
   - FIREBASE_STORAGE_BUCKET
   - FIREBASE_MESSAGING_SENDER_ID
   - FIREBASE_APP_ID
   - FIREBASE_MEASUREMENT_ID
4. Trigger a deployment.

The app includes `vercel.json` and exports the Express app from `server.js`, so no extra build setup is needed.

## Notes

- `/health` returns `{ "ok": true }` for quick uptime checks.
- Quiz state is currently kept in-memory on the server. This is fine for initial testing, but for production multiplayer reliability you should move game state to a persistent store per user/session.
