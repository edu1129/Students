import React, { useState } from 'react';
import { KeyRound, BookOpen, User, Lock } from 'lucide-react'; // Added icons
import { StudentLoginPayload, StudentLoginResponse, MessageType } from '../types';
import { callStudentApi } from '../services/apiService';
import { PRIMARY_COLOR, BORDER_RADIUS, CARD_SHADOW } from '../constants';
import Message from './Message';

interface LoginViewProps {
  onLoginSuccess: (data: StudentLoginResponse) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setApiMessage: (message: MessageType | null) => void;
  apiMessage: MessageType | null;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, setLoading, apiMessage, setApiMessage }) => {
  const [schoolCode, setSchoolCode] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiMessage(null);
    if (!schoolCode || !mobile || !password) {
      setApiMessage({ text: 'All fields are required.', type: 'error' });
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true, 'Attempting login...');
    
    const payload: StudentLoginPayload = { schoolCode, mobile, password };
    const result = await callStudentApi<StudentLoginResponse>('handleStudentLogin', payload);
    
    setLoading(false);
    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess(result);
    } else {
      setApiMessage({ text: result.error || 'Login failed. Please check your details.', type: 'error' });
    }
  };

  return (
    <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 md:p-10 ${BORDER_RADIUS} ${CARD_SHADOW} w-full max-w-sm transform transition-all duration-500 ease-in-out`}>
      <div className="text-center mb-8">
        <BookOpen className={`mx-auto text-${PRIMARY_COLOR} mb-3`} size={48} />
        <h1 className={`text-3xl font-bold text-slate-700 dark:text-white`}>Student Portal</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Access your academic world.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            id="school-code"
            value={schoolCode}
            onChange={(e) => setSchoolCode(e.target.value)}
            required
            placeholder="School Code"
            className={`w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white ${BORDER_RADIUS} focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} transition duration-150 ease-in-out text-sm`}
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-slate-400" /> {/* Using User icon for mobile as well, or Phone icon */}
          </div>
          <input
            type="tel"
            id="student-mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            placeholder="Mobile Number"
            className={`w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white ${BORDER_RADIUS} focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} transition duration-150 ease-in-out text-sm`}
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-slate-400" />
          </div>
          <input
            type="password"
            id="student-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className={`w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white ${BORDER_RADIUS} focus:ring-2 focus:ring-${PRIMARY_COLOR} focus:border-${PRIMARY_COLOR} transition duration-150 ease-in-out text-sm`}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-${PRIMARY_COLOR} hover:bg-blue-700 text-white font-semibold py-3 px-4 ${BORDER_RADIUS} flex items-center justify-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${PRIMARY_COLOR} disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <KeyRound size={20} />
          Login
        </button>
      </form>
      <Message message={apiMessage} onDismiss={() => setApiMessage(null)} />
       <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 text-center">
        &copy; {new Date().getFullYear()} Student Portal. All rights reserved.
      </p>
    </div>
  );
};

export default LoginView;