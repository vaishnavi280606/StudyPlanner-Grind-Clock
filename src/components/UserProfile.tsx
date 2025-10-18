import { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isDarkMode: boolean;
}

export function UserProfile({ isDarkMode }: UserProfileProps) {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

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
          {user.email?.split('@')[0]}
        </span>
        <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-20 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-200'
          }`}>
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Signed in as
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {user.email}
              </p>
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