import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LoginPage from '../../pages/LoginPage.jsx';

/**
 * Protected Route Component
 * Protects routes so only authenticated users can access them
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  /**
   * Show loading spinner only while checking authentication
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-1 text-xs text-gray-600">Checking...</p>
        </div>
      </div>
    );
  }

  /**
   * If user is not authenticated, show login page
   */
  if (!user) {
    return <LoginPage />;
  }

  /**
   * If user is authenticated, render the protected content
   */
  return <>{children}</>;
};

export default ProtectedRoute;
