
import React from 'react';
import { XCircle, CheckCircle, Info } from 'lucide-react';
import { MessageType } from '../types';

interface MessageProps {
  message: MessageType | null;
  onDismiss?: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  const baseClasses = "p-4 rounded-lg flex items-center gap-3 border-l-4 my-4";
  let specificClasses = "";
  let IconComponent: React.ElementType = Info;

  switch (message.type) {
    case 'error':
      specificClasses = "bg-red-50 border-red-500 text-red-700";
      IconComponent = XCircle;
      break;
    case 'success':
      specificClasses = "bg-green-50 border-green-500 text-green-700";
      IconComponent = CheckCircle;
      break;
    case 'info':
      specificClasses = "bg-blue-50 border-blue-500 text-blue-700";
      IconComponent = Info;
      break;
  }

  return (
    <div className={`${baseClasses} ${specificClasses}`} role="alert">
      <IconComponent size={20} className="flex-shrink-0" />
      <span className="text-sm font-medium">{message.text}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-auto -mx-1.5 -my-1.5 bg-transparent rounded-lg p-1.5 inline-flex h-8 w-8 items-center justify-center focus:ring-2"
          aria-label="Dismiss"
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
};

export default Message;
    