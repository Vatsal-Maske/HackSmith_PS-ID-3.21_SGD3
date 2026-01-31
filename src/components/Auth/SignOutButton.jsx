import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Sign-Out Button Component
 * Provides a styled button for user sign-out
 */
const SignOutButton = ({ 
  onSignOutStart, 
  onSignOutSuccess, 
  onSignOutError,
  className = '',
  disabled = false 
}) => {
  const { signOut, loading } = useAuth();

  /**
   * Handle Sign-Out click
   */
  const handleSignOut = async () => {
    try {
      // Notify parent component that sign-out is starting
      if (onSignOutStart) {
        onSignOutStart();
      }

      // Perform sign-out
      const result = await signOut();

      if (result.success) {
        // Notify parent component of successful sign-out
        if (onSignOutSuccess) {
          onSignOutSuccess(result.message);
        }
      } else {
        // Notify parent component of sign-out error
        if (onSignOutError) {
          onSignOutError(result.error);
        }
      }
    } catch (error) {
      console.error('Sign-Out Error:', error);
      if (onSignOutError) {
        onSignOutError('An unexpected error occurred during sign-out');
      }
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center space-x-2
        px-4 py-2 bg-red-600 text-white rounded-lg
        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      {/* Sign-Out Icon */}
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
      </svg>

      {/* Button Text */}
      <span>
        {loading ? 'Signing out...' : 'Sign Out'}
      </span>
    </button>
  );
};

export default SignOutButton;
