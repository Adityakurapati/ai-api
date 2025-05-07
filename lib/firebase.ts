import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getDatabase } from "firebase-admin/database"

const firebaseConfig = {
  credential: cert({
    projectId: "aria-52d18",
    clientEmail: "rrqq510@gmail.com",
    // The private key needs to be properly formatted from an environment variable
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  }),
  databaseURL: "https://aria-52d18-default-rtdb.firebaseio.com",
}

// Initialize Firebase
export function initFirebase() {
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig)
    return app
  }
  return getApps()[0]
}

// Get a reference to the database
export function getFirebaseDatabase() {
  const app = initFirebase()
  return getDatabase(app)
}
