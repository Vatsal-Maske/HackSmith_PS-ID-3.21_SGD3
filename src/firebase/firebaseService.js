import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig.js';

// Initialize Firebase with error handling
let app;
let auth;
let db;
let googleProvider;

try {
  // Check if Firebase config has valid values
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
    console.warn('Firebase API key not configured. Using mock authentication.');
    // Don't throw error, just set variables to null
    app = null;
    auth = null;
    db = null;
    googleProvider = null;
  } else {
    console.log('Firebase configuration found, initializing Firebase...');
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    console.log('Firebase initialized successfully');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Set variables to null for mock authentication
  app = null;
  auth = null;
  db = null;
  googleProvider = null;
}

/**
 * Firebase Authentication Service
 * Handles Google Sign-In, Sign-Out, and user data management
 */
class FirebaseAuthService {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
  }

  /**
   * Initialize authentication and listen for auth state changes
   */
  initializeAuth() {
    console.log('FirebaseAuthService - initializeAuth called');
    console.log('FirebaseAuthService - auth available:', !!auth);
    
    if (!auth) {
      console.warn('Firebase Auth not available. Mock authentication will require manual sign-in.');
      // Set current user to null immediately
      this.currentUser = null;
      // Don't auto-login with mock user - let user click sign-in
      return;
    }

    console.log('FirebaseAuthService - Setting up onAuthStateChanged listener');
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      console.log('FirebaseAuthService - Auth state changed:', user ? user.displayName : 'null');
      this.currentUser = user;
      this.notifyAuthListeners(user);
    });
  }

  /**
   * Sign in with Google
   * @returns {Promise<Object>} User credentials and additional info
   */
  async signInWithGoogle() {
    // Check if Firebase Auth is available
    if (!auth) {
      console.warn('Firebase Auth not available. Using mock sign-in.');
      
      // Mock sign-in for development
      const mockUser = {
        uid: 'mock-user-123',
        displayName: 'Demo User',
        email: 'demo@example.com',
        photoURL: null,
        emailVerified: true
      };
      
      this.currentUser = mockUser;
      this.notifyAuthListeners(mockUser);
      
      return {
        success: true,
        user: {
          uid: mockUser.uid,
          displayName: mockUser.displayName,
          email: mockUser.email,
          photoURL: mockUser.photoURL,
          emailVerified: mockUser.emailVerified
        }
      };
    }

    try {
      console.log('Attempting Google Sign-In with Firebase...');
      
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('Firebase Sign-In successful:', user.displayName);

      // Store user data in Firestore
      await this.storeUserData(user);

      this.currentUser = user;
      this.notifyAuthListeners(user);
      
      return {
        success: true,
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        }
      };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      
      // Handle unauthorized domain error gracefully
      if (error.code === 'auth/unauthorized-domain') {
        console.warn('Domain not authorized in Firebase. Falling back to mock authentication.');
        
        // Create mock user for development
        const mockUser = {
          uid: 'mock-user-123',
          displayName: 'Demo User',
          email: 'demo@example.com',
          photoURL: null,
          emailVerified: true
        };
        
        this.currentUser = mockUser;
        this.notifyAuthListeners(mockUser);
        
        return {
          success: true,
          user: {
            uid: mockUser.uid,
            displayName: mockUser.displayName,
            email: mockUser.email,
            photoURL: mockUser.photoURL,
            emailVerified: mockUser.emailVerified
          }
        };
      }
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<Object>} Sign out result
   */
  async signOut() {
    if (!auth) {
      console.warn('Firebase Auth not available. Using mock sign-out.');
      this.currentUser = null;
      this.notifyAuthListeners(null);
      return {
        success: true,
        message: 'Signed out successfully (mock)'
      };
    }

    try {
      await signOut(auth);
      console.log('User signed out successfully');
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      console.error('Sign Out Error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Store user data in Firestore
   * @param {Object} user - Firebase user object
   */
  async storeUserData(user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        // Additional user preferences
        preferences: {
          theme: 'light',
          notifications: true,
          defaultCity: 'New Delhi'
        }
      };

      // Store user data in Firestore
      await setDoc(userRef, userData, { merge: true });
      console.log('User data stored in Firestore');
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  }

  /**
   * Get user data from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserData(uid) {
    if (!db) {
      console.warn('Firebase Firestore not available. Using mock user data.');
      // Return mock user data for development
      const mockUserData = {
        uid: uid,
        displayName: 'Demo User',
        email: 'demo@example.com',
        photoURL: null,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          defaultCity: 'New Delhi'
        }
      };
      
      return {
        success: true,
        data: mockUserData
      };
    }

    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return {
          success: true,
          data: userDoc.data()
        };
      } else {
        return {
          success: false,
          error: 'User data not found'
        };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Add authentication state listener
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  addAuthListener(callback) {
    console.log('FirebaseAuthService - addAuthListener called');
    this.authListeners.push(callback);
    
    // Immediately call the callback with current user state
    try {
      console.log('FirebaseAuthService - calling callback with currentUser:', this.currentUser);
      callback(this.currentUser);
      console.log('FirebaseAuthService - callback executed successfully');
    } catch (error) {
      console.error('Error in immediate auth listener callback:', error);
    }
    
    // Return unsubscribe function
    return () => {
      console.log('FirebaseAuthService - removing listener');
      this.removeAuthListener(callback);
    };
  }

  /**
   * Remove authentication state listener
   * @param {Function} callback - Callback function to remove
   */
  removeAuthListener(callback) {
    const index = this.authListeners.indexOf(callback);
    if (index > -1) {
      this.authListeners.splice(index, 1);
    }
  }

  /**
   * Notify all auth listeners
   * @param {Object|null} user - Current user
   */
  notifyAuthListeners(user) {
    this.authListeners.forEach(callback => {
      try {
        callback(user);
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  /**
   * Get user-friendly error message
   * @param {Object} error - Firebase error object
   * @returns {string} User-friendly error message
   */
  getErrorMessage(error) {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completion';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by the browser';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later';
      case 'auth/user-not-found':
        return 'User account not found';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email address is already in use';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email address';
      default:
        return error.message || 'An unknown error occurred';
    }
  }
}

// Create and export singleton instance
const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;

// Export individual services for advanced usage
export { auth, db, googleProvider };
