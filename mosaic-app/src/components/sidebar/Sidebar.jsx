import React from 'react';
import { MessageSquare } from 'lucide-react';
import NewChatButton from './NewChatButton';
import ChatItem from './ChatItem';
import UserProfile from './UserProfile';

const Sidebar = ({
  chatSessions,
  currentChatId,
  isOpen,
  isCollapsed,
  isMobile,
  hasChats,
  onSelectChat,
  onCreateNewChat,
  onDeleteChat,
  onUpdateChatTitle
}) => {
  const sortedChats = Object.values(chatSessions)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className={`
      sidebar-container bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 z-50
      ${isMobile 
        ? `fixed inset-y-0 left-0 w-80 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl`
        : `relative ${isCollapsed ? 'w-0' : 'w-80'} overflow-hidden`
      }
    `}>
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <NewChatButton onClick={onCreateNewChat} />
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4">
        {hasChats ? (
          <div className="space-y-2">
            {sortedChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={currentChatId === chat.id}
                isMobile={isMobile}
                onSelect={() => onSelectChat(chat.id)}
                onDelete={() => onDeleteChat(chat.id)}
                onUpdateTitle={(newTitle) => onUpdateChatTitle(chat.id, newTitle)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No chat history yet.</p>
            <p className="text-xs mt-2">Start a new conversation to begin!</p>
          </div>
        )}
      </div>

      {/* User Profile */}
      <UserProfile />
    </div>
  );
};

export default Sidebar;