import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Google Sign-In Button Component
 * Provides a styled button for Google authentication
 */
const GoogleSignInButton = ({ 
  onSignInStart, 
  onSignInSuccess, 
  onSignInError,
  className = '',
  disabled = false 
}) => {
  const { signInWithGoogle, loading } = useAuth();

  /**
   * Handle Google Sign-In click
   */
  const handleSignIn = async () => {
    try {
      // Notify parent component that sign-in is starting
      if (onSignInStart) {
        onSignInStart();
      }

      // Perform Google Sign-In
      const result = await signInWithGoogle();

      if (result.success) {
        // Notify parent component of successful sign-in
        if (onSignInSuccess) {
          onSignInSuccess(result.user);
        }
      } else {
        // Notify parent component of sign-in error
        if (onSignInError) {
          onSignInError(result.error);
        }
      }
    } catch (error) {
      console.error('Sign-In Error:', error);
      if (onSignInError) {
        onSignInError('An unexpected error occurred during sign-in');
      }
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center space-x-3 w-full max-w-xs mx-auto
        px-4 py-3 bg-white border-2 border-gray-300 rounded-lg
        text-gray-700 font-medium text-sm
        hover:bg-gray-50 hover:border-gray-400
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      {/* Google Logo */}
      <svg 
        className="w-5 h-5" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>

      {/* Button Text */}
      <span>
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </span>
    </button>
  );
};

export default GoogleSignInButton;
