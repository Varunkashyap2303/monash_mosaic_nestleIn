import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';
import WelcomeMessage from './WelcomeMessage';

const ChatArea = ({ currentChat, isLoading, hasChats }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {currentChat?.messages?.length > 0 ? (
          currentChat.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        ) : (
          <WelcomeMessage hasChats={hasChats} />
        )}

        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;