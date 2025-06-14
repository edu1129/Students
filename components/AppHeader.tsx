import React from 'react';
import { LogOut, GraduationCap } from 'lucide-react';
import { PRIMARY_COLOR, BORDER_RADIUS, CARD_SHADOW, ACCENT_COLOR } from '../constants';

interface AppHeaderProps {
  onLogout: () => void;
  isLoggedIn: boolean; // Keep this prop, can be true for profile or student selection
}

const AppHeader: React.FC<AppHeaderProps> = ({ onLogout, isLoggedIn }) => {
  if (!isLoggedIn) return null;

  return (
    <header className={`w-full max-w-5xl mb-5 p-4 bg-gradient-to-r from-blue-500 to-${PRIMARY_COLOR} text-white ${BORDER_RADIUS} flex justify-between items-center ${CARD_SHADOW} self-center`}>
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <GraduationCap size={28} />
        Student Portal
      </h1>
      <button
        onClick={onLogout}
        className={`bg-${ACCENT_COLOR} hover:bg-red-700 text-white font-medium py-2 px-4 ${BORDER_RADIUS} flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105`}
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
};

export default AppHeader;