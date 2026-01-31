import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Bell, Mail, Globe, Shield, Palette, Eye, Volume2, Wifi, Database, Save } from 'lucide-react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    desktop: true
  });
  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
    cookies: true
  });
  const [saved, setSaved] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '{}');
    const savedPrivacy = JSON.parse(localStorage.getItem('privacy') || '{}');

    setTheme(savedTheme);
    setDarkMode(savedDarkMode);
    setNotifications(prev => ({ ...prev, ...savedNotifications }));
    setPrivacy(prev => ({ ...prev, ...savedPrivacy }));
    
    // Apply initial theme
    applyTheme(savedTheme, savedDarkMode);
  }, []);

  // Apply theme to document
  const applyTheme = (selectedTheme, isDarkMode) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    } else {
      root.classList.toggle('dark', selectedTheme === 'dark');
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemDark);
      localStorage.setItem('darkMode', systemDark);
      applyTheme('system', systemDark);
    } else {
      const isDark = newTheme === 'dark';
      setDarkMode(isDark);
      localStorage.setItem('darkMode', isDark);
      applyTheme(newTheme, isDark);
    }
  };

  // Handle notification changes
  const handleNotificationChange = (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  // Handle privacy changes
  const handlePrivacyChange = (key, value) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    localStorage.setItem('privacy', JSON.stringify(updated));
  };

  // Save all settings
  const handleSave = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('privacy', JSON.stringify(privacy));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setDarkMode(e.matches);
        localStorage.setItem('darkMode', e.matches);
        applyTheme('system', e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your application preferences and privacy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appearance Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Palette className="text-gray-600 dark:text-gray-300" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Sun size={24} className="mb-2 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Moon size={24} className="mb-2 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      theme === 'system'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Monitor size={24} className="mb-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">System</span>
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {theme === 'system' 
                  ? `Following system preference (${darkMode ? 'dark' : 'light'} mode)`
                  : `Using ${theme} mode`
                }
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Bell className="text-gray-600 dark:text-gray-300" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive air quality alerts via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('email', !notifications.email)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Bell size={18} className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Browser notifications for alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('push', !notifications.push)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Volume2 size={18} className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Sound Alerts</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Play sound for critical alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('desktop', !notifications.desktop)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.desktop ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.desktop ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="text-gray-600 dark:text-gray-300" size={20} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h3>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Database size={18} className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Share Usage Data</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Help improve the app by sharing anonymous usage data</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePrivacyChange('shareData', !privacy.shareData)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.shareData ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.shareData ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Eye size={18} className="text-gray-600 dark:text-gray-300" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Analytics</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Allow analytics cookies for better experience</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePrivacyChange('analytics', !privacy.analytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.analytics ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{theme}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{darkMode ? 'On' : 'Off'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Notifications</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Object.values(notifications).filter(Boolean).length} active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleSave}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save size={18} />
                <span>Save Settings</span>
              </button>
              
              <button
                onClick={() => {
                  localStorage.clear();
                  setTheme('system');
                  setDarkMode(false);
                  setNotifications({ email: true, push: false, sms: false, desktop: true });
                  setPrivacy({ shareData: false, analytics: true, cookies: true });
                  applyTheme('system', false);
                }}
                className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <span>Reset to Defaults</span>
              </button>
            </div>
            
            {saved && (
              <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm text-center rounded-lg">
                Settings saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
