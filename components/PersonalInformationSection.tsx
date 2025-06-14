import React from 'react';
import { UserCircle } from 'lucide-react';
import ProfileSection from './ProfileSection';
import InfoGridItem from './InfoGridItem';
import { StudentProfile } from '../types';
import { PERSONAL_INFO_ORDER } from '../constants';
import { formatDisplayDate, sanitizeText, keyToDisplayLabel } from '../utils/formatter';

interface PersonalInformationSectionProps {
  profile?: StudentProfile;
}

const PersonalInformationSection: React.FC<PersonalInformationSectionProps> = ({ profile }) => {
  if (!profile) {
    return (
      <ProfileSection title="Personal Information" icon={<UserCircle size={24} />}>
        <p className="text-slate-500">Personal information not available.</p>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection title="Personal Information" icon={<UserCircle size={24} />} id="personal-info-section">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {PERSONAL_INFO_ORDER.map(key => {
          let value = profile[key];
          if (typeof key === 'string' && key.toLowerCase().includes('date')) {
            value = formatDisplayDate(value as string);
          } else {
            value = sanitizeText(value as string) || 'N/A';
          }
          return <InfoGridItem key={key} label={keyToDisplayLabel(key as string)} value={value} />;
        })}
      </div>
    </ProfileSection>
  );
};

export default PersonalInformationSection;
