
import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { User } from 'lucide-react';
import { sanitizeText } from '../utils/formatter';

interface ProfileHeaderProps {
  profile: StudentProfile;
}

const ProfilePhoto: React.FC<{url?: string, name?: string}> = ({ url, name }) => {
  const [error, setError] = useState(false);
  const placeholderIcon = <User size={48} className="text-slate-400" />;
  
  const initials = name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

  if (error || !url) {
    return (
      <div className="w-28 h-28 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white shadow-md mx-auto mb-3 text-3xl font-semibold text-slate-500">
        {initials || placeholderIcon}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={sanitizeText(name) || "Student photo"}
      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto mb-3"
      onError={() => setError(true)}
    />
  );
};


const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="text-center mb-8 pt-2">
      <ProfilePhoto url={profile.PhotoURL} name={profile.Name} />
      <h1 className="text-3xl font-bold text-slate-800">
        {sanitizeText(profile.Name) || 'N/A'}
      </h1>
      <p className="text-slate-500 text-md">
        Class: {sanitizeText(profile.ClassNameWithSection || profile.Class) || 'N/A'} | Roll No: {sanitizeText(profile.RollNumber) || 'N/A'}
      </p>
    </div>
  );
};

export default ProfileHeader;
    