// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Hapus baris ini karena sudah menggunakan Supabase storage
// import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBbvXQQoSG33cyMsdHYwgjSFKd2cZ8NpEI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "snbtku-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "snbtku-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "snbtku-project.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "283605769123",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:283605769123:web:1e553f5e3c8cc3ffb71816",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0WSKY4PLZ9"
};

// Validate required environment variables in production
if (import.meta.env.PROD) {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Hapus baris ini
// export const storage = getStorage(app);

// Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Authentication functions

/**
 * Mendaftarkan pengguna baru dengan email dan password
 * @param email - Email pengguna
 * @param password - Password pengguna
 * @param displayName - Nama yang akan ditampilkan
 * @returns Promise yang menyelesaikan UserCredential
 */
export const registerWithEmailAndPassword = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile dengan displayName
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  } catch (error) {
    console.error("Error registering with email and password:", error);
    throw error;
  }
};

/**
 * Login dengan email dan password
 * @param email - Email pengguna
 * @param password - Password pengguna
 * @returns Promise yang menyelesaikan UserCredential
 */
export const loginWithEmailAndPassword = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in with email and password:", error);
    throw error;
  }
};

/**
 * Login dengan Google
 * @returns Promise yang menyelesaikan UserCredential
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Logout pengguna saat ini
 * @returns Promise yang menyelesaikan void
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Mengirim email reset password
 * @param email - Email pengguna
 * @returns Promise yang menyelesaikan void
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Mendapatkan pengguna saat ini
 * @returns User saat ini atau null jika tidak ada pengguna yang login
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Mendaftarkan callback untuk perubahan status autentikasi
 * @param callback - Fungsi yang akan dipanggil ketika status autentikasi berubah
 * @returns Fungsi untuk unsubscribe dari listener
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;