import { initializeApp, getApps, cert, App } from "firebase-admin/app";

let app: App | null = null;

export const initFirebaseAdmin = (): void => {
  if (getApps().length > 0) {
    app = getApps()[0];
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "Firebase Admin credentials are missing. Google Sign-In will not work until FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
    );
    return;
  }

  app = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
};

export const isFirebaseAdminReady = (): boolean => app !== null;
