
import React from 'react';
import { BORDER_RADIUS, CARD_SHADOW } from '../constants';

interface ProfileSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon, children, className = '', id }) => {
  return (
    <section id={id} className={`bg-white p-6 ${BORDER_RADIUS} ${CARD_SHADOW} mb-6 ${className}`}>
      <h2 className="text-xl font-semibold text-blue-600 border-b border-slate-200 pb-3 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
};

export default ProfileSection;
    