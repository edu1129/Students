
import React from 'react';
import { PRIMARY_COLOR } from '../constants';

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-85 flex flex-col justify-center items-center z-[9999] transition-opacity duration-300 ease-in-out">
      <div className={`w-12 h-12 border-4 border-slate-200 border-l-${PRIMARY_COLOR} rounded-full animate-spin`}></div>
      {message && <p className="mt-4 font-medium text-slate-700 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingOverlay;
    