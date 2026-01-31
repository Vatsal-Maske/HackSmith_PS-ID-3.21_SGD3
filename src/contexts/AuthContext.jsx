import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseAuthService from '../firebase/firebaseService.js';

// Create authentication context
const AuthContext = createContext();

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth methods to children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialize authentication on component mount
   */
  useEffect(() => {
    if (initialized) {
      return;
    }

    console.log('AuthProvider - initializing authentication');
    setInitialized(true);
    
    // Initialize Firebase Auth
    firebaseAuthService.initializeAuth();

    // Add auth state listener - this will immediately call the callback
    const unsubscribe = firebaseAuthService.addAuthListener((authUser) => {
      console.log('AuthProvider - auth state changed:', authUser);
      setUser(authUser);
      setLoading(false);
      setError(null);
    });

    // Set a timeout to ensure loading is cleared even if listener doesn't fire
    const timeout = setTimeout(() => {
      console.log('AuthProvider - timeout reached, setting loading to false');
      setLoading(false);
    }, 1000);

    // Cleanup listener on unmount
    return () => {
      console.log('AuthProvider - cleanup');
      if (unsubscribe) {
        firebaseAuthService.removeAuthListener(unsubscribe);
      }
      clearTimeout(timeout);
    };
  }, [initialized]);

  /**
   * Sign in with Google
   * @returns {Promise<Object>} Sign in result
   */
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseAuthService.signInWithGoogle();
      
      if (result.success) {
        setUser(result.user);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = 'Failed to sign in with Google';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out current user
   * @returns {Promise<Object>} Sign out result
   */
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseAuthService.signOut();
      
      if (result.success) {
        setUser(null);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      const errorMessage = 'Failed to sign out';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get user data from Firestore
   * @param {string} uid - User ID
   * @returns {Promise<Object>} User data result
   */
  const getUserData = async (uid) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await firebaseAuthService.getUserData(uid);
      return result;
    } catch (err) {
      const errorMessage = 'Failed to get user data';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear any authentication errors
   */
  const clearError = () => {
    setError(null);
  };

  // Context value object
  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated: !!user,
    
    // Methods
    signInWithGoogle,
    signOut,
    getUserData,
    clearError,
    
    // Firebase service (for advanced usage)
    firebaseAuthService
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
