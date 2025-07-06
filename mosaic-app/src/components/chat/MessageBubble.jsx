import React from 'react';
import { Bot, User } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';

const MessageBubble = ({ message }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-600 ml-2' : 'bg-gray-600 mr-2'}`}>
          {message.sender === 'user' ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={`rounded-lg px-4 py-3 ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-100 shadow-sm border border-gray-600'
        }`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-2 ${
            message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
          }`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;