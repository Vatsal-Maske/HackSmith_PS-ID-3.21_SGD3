import React, { useState, useEffect } from 'react';
import { User, Mail, Building, MapPin, Settings, LogOut, Bell, Globe, Shield, Calendar, Info, X, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProfileAvatar from './ProfileAvatar.jsx';

export default function Profile() {
  const { user, getUserData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false for immediate render
  const [saving, setSaving] = useState(false); // For form submission loading
  const [formData, setFormData] = useState({
    fullName: 'Demo User',
    email: 'demo@example.com',
    organization: '',
    role: 'Air Quality Analyst'
  });

  const [preferences, setPreferences] = useState({
    defaultCity: 'New Delhi',
    enableAlerts: true,
    emailNotifications: false,
    darkMode: false
  });

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Initialize form data immediately from auth user or defaults
  useEffect(() => {
    if (user) {
      console.log('Profile - Setting form data from user:', user);
      setFormData({
        fullName: user.displayName || 'Demo User',
        email: user.email || 'demo@example.com',
        organization: '',
        role: 'Air Quality Analyst'
      });
    } else {
      console.log('Profile - No user available, using default data');
      // Set default data immediately without waiting
      setFormData({
        fullName: 'Demo User',
        email: 'demo@example.com',
        organization: '',
        role: 'Air Quality Analyst'
      });
    }
  }, [user]);

  // Load user data from Firestore in background (non-blocking)
  useEffect(() => {
    const loadUserData = async () => {
      if (user && getUserData) {
        try {
          setLoading(true);
          const result = await getUserData(user.uid);
          
          if (result.success) {
            setUserData(result.data);
            setFormData({
              fullName: result.data.displayName || user.displayName || 'Demo User',
              email: result.data.email || user.email || 'demo@example.com',
              organization: result.data.organization || '',
              role: result.data.role || 'Air Quality Analyst'
            });
            setPreferences(result.data.preferences || preferences);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    // Only load if user is available and getUserData function exists
    if (user && getUserData) {
      loadUserData();
    }
  }, [user, getUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveChanges = () => {
    console.log('Saving profile changes:', formData);
    console.log('Saving preferences:', preferences);
    // In a real app, this would save to backend
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      console.log('Saving profile data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would save to backend
      console.log('Profile saved successfully');
      
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // In a real app, this would handle logout logic
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'DU'; // Default to DU for Demo User
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Ensure we always have some data to display immediately
  const displayData = {
    fullName: formData.fullName || 'Demo User',
    email: formData.email || 'demo@example.com',
    organization: formData.organization || '',
    role: formData.role || 'Air Quality Analyst'
  };

  console.log('Profile component - displayData:', displayData);
  console.log('Profile component - user:', user);
  console.log('Profile component - loading:', loading);

  // Show loading state while user data is being loaded
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Loading Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-6">
            {/* Avatar Skeleton */}
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
            
            {/* User Info Skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preferences Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render immediately without any loading state
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="relative cursor-pointer group">
            {/* Simple fallback avatar for testing */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold transition-transform group-hover:scale-105">
                {displayData.fullName ? displayData.fullName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : 'DU'}
              </div>
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900">{displayData.fullName}</h2>
            <p className="text-gray-600">{displayData.role}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Mail size={16} />
                <span>{displayData.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

            {/* Avatar Modal - Temporarily disabled for testing */}
      {/* {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <ProfileAvatar 
                  name={displayData.fullName}
                  size="2xl"
                  showBorder={true}
                  animate={true}
                  showStatus={true}
                  statusColor="green"
                  className="mx-auto"
                />
              </div>
              
              <p className="text-gray-600 mb-4">
                {displayData.fullName}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Initials: {displayData.fullName.split(' ').map(word => word[0]).join('').toUpperCase()}
              </p>
              
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Upload New Photo
                </button>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your organization"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your role"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preferences and System Info */}
        <div className="space-y-6">
          {/* Preferences Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <select
                    value={preferences.defaultCity}
                    onChange={(e) => handlePreferenceChange('defaultCity', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option>New Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                    <option>Kolkata</option>
                    <option>Hyderabad</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Bell size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Air Quality Alerts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePreferenceChange('enableAlerts', !preferences.enableAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.enableAlerts ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.enableAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Info className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">System Info</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span>Last Login</span>
                </div>
                <span className="text-gray-900 font-medium">Jan 31, 2026</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield size={16} />
                  <span>Account Type</span>
                </div>
                <span className="text-gray-900 font-medium">Premium</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Info size={16} />
                  <span>App Version</span>
                </div>
                <span className="text-gray-900 font-medium">v2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
