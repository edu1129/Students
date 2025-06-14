
import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import StudentSelectionView from './components/StudentSelectionView';
import ProfileView from './components/ProfileView';
import AppHeader from './components/AppHeader';
import LoadingOverlay from './components/LoadingOverlay';
import Message from './components/Message';
import { ViewState, StudentFullData, StudentLoginResponse, StudentListItem, MessageType } from './types';
import { PRIMARY_COLOR } from './constants';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('login');
  const [currentStudentData, setCurrentStudentData] = useState<StudentFullData | null>(null);
  const [studentList, setStudentList] = useState<StudentListItem[]>([]);
  const [currentSchoolSpreadsheetId, setCurrentSchoolSpreadsheetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [apiMessage, setApiMessage] = useState<MessageType | null>(null);

  useEffect(() => {
    const savedStudentData = sessionStorage.getItem('currentStudentData');
    const savedSpreadsheetId = sessionStorage.getItem('currentSchoolSpreadsheetId');
    if (savedStudentData && savedSpreadsheetId) {
      try {
        const parsedData = JSON.parse(savedStudentData);
        setCurrentStudentData(parsedData);
        setCurrentSchoolSpreadsheetId(savedSpreadsheetId);
        setViewState('profile');
      } catch (e) {
        sessionStorage.clear();
        setViewState('login');
      }
    }
  }, []);

  useEffect(() => {
    if (viewState === 'login') {
      document.body.classList.add('login-active-bg');
      document.body.classList.remove('bg-slate-100');
    } else {
      document.body.classList.remove('login-active-bg');
      document.body.classList.add('bg-slate-100');
    }
  }, [viewState]);

  const handleSetLoading = (loading: boolean, message: string = '') => {
    setIsLoading(loading);
    setLoadingMessage(message);
  };

  const handleLoginSuccess = (data: StudentLoginResponse) => {
    setApiMessage(null);
    if (data.spreadsheetId) {
      setCurrentSchoolSpreadsheetId(data.spreadsheetId);
      sessionStorage.setItem('currentSchoolSpreadsheetId', data.spreadsheetId);
    }

    if (data.multipleStudents && data.studentList) {
      setStudentList(data.studentList);
      setViewState('selectStudent');
    } else if (data.studentData) {
      setCurrentStudentData(data.studentData);
      sessionStorage.setItem('currentStudentData', JSON.stringify(data.studentData));
      setViewState('profile');
    } else {
      setApiMessage({ text: 'Login successful, but no student data found.', type: 'error' });
      setViewState('login');
    }
  };

  const handleStudentSelected = (data?: StudentFullData) => {
    setApiMessage(null);
    if (data) {
      setCurrentStudentData(data);
      sessionStorage.setItem('currentStudentData', JSON.stringify(data));
      setViewState('profile');
    } else {
      setApiMessage({ text: 'Failed to load student details. Please try again.', type: 'error'});
      // Decide if we should stay on selection or move to profile with error
      setViewState('profile'); // Or 'selectStudent' if preferred to show error there
    }
  };

  const handleLogout = () => {
    setCurrentStudentData(null);
    setCurrentSchoolSpreadsheetId(null);
    setStudentList([]);
    setApiMessage(null);
    sessionStorage.clear();
    setViewState('login');
  };

  const handleBackToLogin = () => {
    setCurrentSchoolSpreadsheetId(null);
    setStudentList([]);
    setApiMessage(null);
    setViewState('login');
  };
  
  const renderView = () => {
    switch (viewState) {
      case 'login':
        return (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            setLoading={handleSetLoading}
            apiMessage={apiMessage}
            setApiMessage={setApiMessage}
          />
        );
      case 'selectStudent':
        if (!currentSchoolSpreadsheetId) {
            // This case should ideally not happen if state transitions are correct
            setApiMessage({ text: "An error occurred. Please log in again.", type: "error"});
            setViewState('login');
            return null;
        }
        return (
          <StudentSelectionView
            students={studentList}
            spreadsheetId={currentSchoolSpreadsheetId}
            onStudentSelected={handleStudentSelected}
            onBackToLogin={handleBackToLogin}
            setLoading={handleSetLoading}
            setApiMessage={setApiMessage}
          />
        );
      case 'profile':
        return (
          <ProfileView
            studentData={currentStudentData}
            spreadsheetId={currentSchoolSpreadsheetId} // Though not directly used by ProfileView, good for context
            setLoading={handleSetLoading}
            apiMessage={apiMessage}
            setApiMessage={setApiMessage}
          />
        );
      default:
        // Fallback to login view
        return <LoginView onLoginSuccess={handleLoginSuccess} setLoading={handleSetLoading} apiMessage={apiMessage} setApiMessage={setApiMessage} />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${viewState === 'login' ? '' : 'bg-slate-100'}`}>
      <LoadingOverlay isVisible={isLoading} message={loadingMessage} />
      <AppHeader isLoggedIn={viewState === 'profile' || viewState === 'selectStudent'} onLogout={handleLogout} />
      <main className={`w-full flex flex-1 justify-center ${viewState === 'profile' ? 'items-start pt-6 md:pt-8' : 'items-center'} p-4 md:px-6 pb-6`}>
        {renderView()}
      </main>
      {/* Fallback UI for when profile data is expected but missing, not during loading */}
      {viewState === 'profile' && !currentStudentData && !isLoading && (
         <div className={`bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md text-center my-10 mx-auto`}>
            <Message message={{text: apiMessage?.text || "No student data loaded or session expired. Please log in again.", type: apiMessage?.type || "info"}} />
             <button
                onClick={handleLogout}
                className={`mt-4 bg-${PRIMARY_COLOR} hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg`}
            >
                Go to Login
            </button>
         </div>
      )}
    </div>
  );
};

export default App;
