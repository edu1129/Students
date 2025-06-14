import React, { useRef } from 'react';
import ProfileHeader from './ProfileHeader';
import PersonalInformationSection from './PersonalInformationSection';
import FeesSection from './FeesSection';
import AttendanceSection from './AttendanceSection';
import ActionSection from './ActionSection';
import Message from './Message';
import { StudentFullData, MessageType } from '../types';
import { BORDER_RADIUS, CARD_SHADOW } from '../constants';

interface ProfileViewProps {
  studentData: StudentFullData | null;
  spreadsheetId: string | null; 
  setLoading: (loading: boolean, message?: string) => void;
  apiMessage: MessageType | null; 
  setApiMessage: (message: MessageType | null) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ studentData, setLoading, apiMessage, setApiMessage }) => {
  const profileViewRef = useRef<HTMLDivElement>(null);

  if (apiMessage && !studentData) { 
    return (
       <div className={`bg-white p-8 md:p-10 ${BORDER_RADIUS} ${CARD_SHADOW} w-full max-w-2xl text-center animate-fadeIn`}>
          <Message message={apiMessage} onDismiss={() => setApiMessage(null)} />
       </div>
    );
  }
  
  if (!studentData) {
    return (
      <div className={`bg-white p-8 md:p-10 ${BORDER_RADIUS} ${CARD_SHADOW} w-full max-w-2xl text-center animate-fadeIn`}>
        <p className="text-slate-600 text-lg">No student data available. Please try logging in again.</p>
      </div>
    );
  }

  // The main div for ProfileView content. It will expand vertically as needed.
  // Page scrolling will be handled by the browser if this div's height exceeds viewport.
  return (
    <div ref={profileViewRef} id="profile-view-content" className={`w-full max-w-4xl animate-fadeIn`}>
        <ProfileHeader profile={studentData.profile} />
        <PersonalInformationSection profile={studentData.profile} />
        <FeesSection fees={studentData.fees} />
        <AttendanceSection attendance={studentData.attendance} />
        <ActionSection
          studentData={studentData}
          profileViewRef={profileViewRef}
          setLoading={setLoading}
        />
    </div>
  );
};

export default ProfileView;