import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import ChatArea from '../chat/ChatArea';
import Header from '../ui/Header';
import ConfirmDialog from '../ui/ConfirmDialog';

const Layout = ({
  // Chat props
  currentChat,
  chatSessions,
  currentChatId,
  isLoading,
  hasChats,
  
  // Sidebar props
  sidebarCollapsed,
  sidebarOpen,
  isMobile,
  
  // Delete confirmation props
  showDeleteConfirm,
  
  // Event handlers
  onToggleSidebar,
  onSelectChat,
  onCreateNewChat,
  onDeleteChat,
  onConfirmDelete,
  onCancelDelete,
  onSendMessage,
  onUpdateChatTitle
}) => {
  return (
    <div className="flex h-screen w-screen bg-gray-900 fixed inset-0 relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <Sidebar
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        hasChats={hasChats}
        onSelectChat={onSelectChat}
        onCreateNewChat={onCreateNewChat}
        onDeleteChat={onDeleteChat}
        onUpdateChatTitle={onUpdateChatTitle}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Chat"
          message="Are you sure you want to delete this chat? This action cannot be undone."
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={currentChat?.title || 'Welcome'}
          onToggleSidebar={onToggleSidebar}
          sidebarOpen={sidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
        />
        
        <ChatArea
          currentChat={currentChat}
          isLoading={isLoading}
          hasChats={hasChats}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
};

export default Layout;