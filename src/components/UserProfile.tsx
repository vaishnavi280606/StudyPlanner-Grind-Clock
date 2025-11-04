import { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Edit2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isDarkMode: boolean;
  variant?: 'sidebar' | 'header';
}

export function UserProfile({ isDarkMode, variant = 'header' }: UserProfileProps) {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    // Load saved name from localStorage
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    } else if (user?.email) {
      setUserName(user.email.split('@')[0]);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('userName', tempName.trim());
    }
    setIsEditingName(false);
    setTempName('');
  };

  const handleEditName = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const displayName = userName || user?.email?.split('@')[0] || 'User';

  // Sidebar variant - expanded view
  if (variant === 'sidebar') {
    return (
      <div className={`p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <User size={20} />
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className={`flex-1 px-2 py-1 text-sm rounded border ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  placeholder="Enter your name"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 rounded hover:bg-slate-700 transition-colors"
                >
                  <Check size={16} className="text-green-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {displayName}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleEditName}
                  className={`p-1.5 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                  }`}
                  title="Edit name"
                >
                  <Edit2 size={14} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDarkMode 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    );
  }

  // Header variant - compact dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          isDarkMode 
            ? 'text-slate-300 hover:bg-slate-700' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
        }`}>
          <User size={16} />
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {displayName}
        </span>
        <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-lg border z-20 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Your Name
              </p>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className={`flex-1 px-2 py-1 text-sm rounded border ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 rounded hover:bg-slate-700 transition-colors"
                  >
                    <Check size={16} className="text-green-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {displayName}
                  </p>
                  <button
                    onClick={handleEditName}
                    className={`p-1 rounded transition-colors ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                    }`}
                  >
                    <Edit2 size={14} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                isDarkMode 
                  ? 'text-slate-300 hover:bg-slate-700' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}