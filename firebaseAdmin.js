import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (raw && raw.trim().length > 0) {
    return JSON.parse(raw);
  }

  if (base64 && base64.trim().length > 0) {
    const decoded = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(decoded);
  }

  return null;
}

function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccount = parseServiceAccount();

  if (serviceAccount) {
    if (typeof serviceAccount.private_key === "string") {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );
    }

    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return initializeApp({
    credential: applicationDefault(),
  });
}

export function getAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
