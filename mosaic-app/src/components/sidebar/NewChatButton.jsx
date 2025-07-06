import React from 'react';
import { Plus } from 'lucide-react';

const NewChatButton = ({ onCreateNewChat }) => {
  return (
    <div className="p-4 border-b border-gray-700 flex-shrink-0">
      <button
        onClick={onCreateNewChat}
        className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">New Chat</span>
      </button>
    </div>
  );
};

export default NewChatButton;