import React from 'react';
import { Bot } from 'lucide-react';

const WelcomeMessage = ({ hasChats }) => {
  return (
    <div className="text-center text-gray-400 py-12">
      <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">Welcome to MOSAIC Chat!</h3>
      <p className="text-sm mb-4 px-4">
        {hasChats 
          ? "Select a chat from the sidebar or start a new conversation below." 
          : "Start a conversation with your AI assistant."
        }
      </p>
      <p className="text-xs px-4">
        {hasChats 
          ? "Click on any chat in the sidebar to continue where you left off." 
          : "Click \"New Chat\" or type a message below to begin."
        }
      </p>
    </div>
  );
};

export default WelcomeMessage;