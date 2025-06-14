
import React from 'react';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { StudentListItem, StudentFullData, StudentDetailsResponse, MessageType } from '../types';
import { callStudentApi } from '../services/apiService';
import { PRIMARY_COLOR, BORDER_RADIUS, CARD_SHADOW, SECONDARY_COLOR } from '../constants';

interface StudentSelectionViewProps {
  students: StudentListItem[];
  spreadsheetId: string;
  onStudentSelected: (data: StudentFullData) => void;
  onBackToLogin: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  setApiMessage: (message: MessageType | null) => void; // To display errors in ProfileView if selection fails badly
}

const StudentSelectionView: React.FC<StudentSelectionViewProps> = ({
  students,
  spreadsheetId,
  onStudentSelected,
  onBackToLogin,
  setLoading,
  setApiMessage,
}) => {
  const handleSelectStudent = async (studentId: string) => {
    setLoading(true, 'Fetching student details...');
    const result = await callStudentApi<StudentDetailsResponse>('getStudentFullDetails', { studentId, spreadsheetId });
    setLoading(false);

    if (result.success && result.data) {
      onStudentSelected(result.data);
    } else {
      // This message might be better shown in the ProfileView or a general app message area
      setApiMessage({ text: result.error || 'Could not load selected profile.', type: 'error' });
      // Potentially transition to profile view but show error, or stay here with error.
      // For now, let App.tsx handle the view transition and message display.
      // If error, it might mean App.tsx keeps this view or shows profile with error.
      onStudentSelected(undefined as any); // Indicate failure or partial data
    }
  };

  return (
    <div className={`bg-white p-8 ${BORDER_RADIUS} ${CARD_SHADOW} w-full max-w-lg text-center`}>
      <h2 className={`text-2xl font-bold text-${PRIMARY_COLOR} mb-4`}>Select Your Profile</h2>
      <p className="text-slate-600 mb-6 text-sm">Multiple profiles found with these credentials. Please select yours:</p>
      <div className="space-y-3 mb-6">
        {students.map((student) => (
          <button
            key={student.studentId}
            onClick={() => handleSelectStudent(student.studentId)}
            className={`w-full bg-${SECONDARY_COLOR} hover:bg-green-600 text-white font-medium py-3 px-4 ${BORDER_RADIUS} flex items-center gap-3 text-left transition-colors duration-150 ease-in-out text-sm`}
          >
            <UserCheck size={20} />
            <span>{student.name} - Class: {student.className}</span>
          </button>
        ))}
      </div>
      <button
        onClick={onBackToLogin}
        className={`w-full bg-slate-500 hover:bg-slate-600 text-white font-medium py-3 px-4 ${BORDER_RADIUS} flex items-center justify-center gap-2 transition-colors duration-150 ease-in-out text-sm`}
      >
        <ArrowLeft size={20} />
        Back to Login
      </button>
    </div>
  );
};

export default StudentSelectionView;
    