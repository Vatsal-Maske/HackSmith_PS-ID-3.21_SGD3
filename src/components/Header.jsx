import { useState, useEffect, useRef } from 'react'
import { Search, UserCircle2, Loader2, User, LogOut, ChevronDown } from 'lucide-react'
import { fetchCities } from '../api/client'
import { useAuth } from '../contexts/AuthContext.jsx'
import SignOutButton from './Auth/SignOutButton.jsx'

export default function Header({ city, onCityChange, onNavigate }) {
  const { user } = useAuth();
  const [allCities, setAllCities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const containerRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Fetch available cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCities();
        // Handle potentially null/undefined data safely
        if (Array.isArray(data)) {
          setAllCities(data);
        } else {
          setAllCities([]);
        }
      } catch (err) {
        console.error("Failed to load city suggestions:", err);
        setAllCities([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCities();
  }, []);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileMenuClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMenuOptionClick = (option) => {
    setShowProfileMenu(false);
    switch(option) {
      case 'profile':
        // Navigate to profile using the parent navigation function
        if (onNavigate) {
          onNavigate('profile');
        }
        break;
      case 'logout':
        // Dummy logout action
        console.log('Logging out...');
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onCityChange(val);

    // Filter suggestions if input length >= 2
    if (val && val.length >= 2) {
      const filtered = allCities.filter(c =>
        c && c.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (selectedCity) => {
    onCityChange(selectedCity);
    setShowSuggestions(false);
  };

  return (
    <header className="flex flex-col gap-3 border-b border-slate-200/70 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-900 md:text-xl">
          Air Quality Health Impact Dashboard
        </h1>
        <div className="mt-1 text-xs text-slate-600">
          Monitoring air pollution and respiratory risk for urban planning • Last updated: {new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Container */}
        <div className="relative w-full max-w-[420px]" ref={containerRef}>
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={city}
            onChange={handleInputChange}
            onFocus={() => { if (city && city.length >= 2) setShowSuggestions(true); }}
            placeholder="Search city name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg scrollbar-thin scrollbar-thumb-slate-200">
              {isLoading ? (
                <div className="flex items-center justify-center py-4 text-slate-400">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span className="text-xs">Loading suggestions...</span>
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition"
                  >
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-xs text-slate-400">
                  No suggestions found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={handleProfileMenuClick}
            className="flex items-center space-x-2 h-11 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="User Profile"
          >
            {/* User Avatar or Default Icon */}
            {user?.displayName ? (
              <div className="relative w-8 h-8 group">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold transition-transform group-hover:scale-105">
                  {user.displayName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              </div>
            ) : (
              <UserCircle2 size={22} />
            )}
            <ChevronDown size={16} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 group">
                    {user?.displayName ? (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold transition-transform group-hover:scale-105">
                        {user.displayName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    ) : (
                      <UserCircle2 size={40} className="text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Options */}
              <button
                onClick={() => handleMenuOptionClick('profile')}
                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              
              <hr className="my-1 border-gray-200" />
              
              {/* Sign Out Button */}
              <div className="px-4 py-2">
                <SignOutButton
                  onSignOutSuccess={() => setShowProfileMenu(false)}
                  className="w-full text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
