import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';

export const useChat = (userId, isUserIdReady) => {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatSessions, setChatSessions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const initializationRef = useRef(false);

  // Load chat sessions when user ID is ready
  useEffect(() => {
    if (!initializationRef.current && isUserIdReady && userId) {
      initializationRef.current = true;
      loadChatSessions();
    }
  }, [userId, isUserIdReady]);

  const loadChatSessions = async () => {
    try {
      console.log('Loading chat sessions for user:', userId);
      const data = await chatAPI.getSessions(userId);
      
      if (data.success && data.data.sessions.length > 0) {
        const sessions = {};
        
        // Load full chat history for each session
        for (const session of data.data.sessions) {
          try {
            const historyData = await chatAPI.getChatHistory(session.chatId, userId);
            
            if (historyData.success) {
              sessions[session.chatId] = {
                id: session.chatId,
                title: session.title,
                messages: historyData.data.messages.map(msg => ({
                  id: msg.messageId,
                  text: msg.text,
                  sender: msg.sender,
                  timestamp: new Date(msg.timestamp)
                })),
                createdAt: new Date(session.createdAt)
              };
            }
          } catch (error) {
            console.error(`Error loading history for session ${session.chatId}:`, error);
          }
        }
        
        setChatSessions(sessions);
        setCurrentChatId(null);
      } else {
        console.log('No existing sessions found');
        setChatSessions({});
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setChatSessions({});
      setCurrentChatId(null);
    } finally {
      setIsInitialized(true);
    }
  };

  const selectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const createNewChat = async () => {
    try {
      console.log('Creating new chat session...');
      const data = await chatAPI.createNewSession(userId, 'New Chat');
      
      if (data.success) {
        const newChatId = data.data.chatId;
        
        const newSession = {
          id: newChatId,
          title: 'New Chat',
          messages: [],
          createdAt: new Date()
        };
        
        setChatSessions(prev => ({ ...prev, [newChatId]: newSession }));
        setCurrentChatId(newChatId);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const data = await chatAPI.deleteSession(chatId, userId);
      
      if (data.success) {
        setChatSessions(prev => {
          const newSessions = { ...prev };
          delete newSessions[chatId];
          return newSessions;
        });
        
        if (chatId === currentChatId) {
          setCurrentChatId(null);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const updateChatTitle = async (chatId, newTitle) => {
    if (!newTitle.trim()) return;
    
    try {
      const data = await chatAPI.updateChatTitle(chatId, newTitle.trim(), userId);
      
      if (data.success) {
        setChatSessions(prev => ({
          ...prev,
          [chatId]: {
            ...prev[chatId],
            title: newTitle.trim()
          }
        }));
      }
    } catch (error) {
      console.error('Error updating chat title:', error);
    }
  };

  const generateTitle = (message) => {
    const words = message.trim().split(/\s+/);
    if (words.length === 1) return words[0];
    return words.slice(0, 3).join(' ');
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    let chatId = currentChatId;

    // Create new chat if none exists
    if (!chatId) {
      try {
        console.log('Creating new chat session for message...');
        const data = await chatAPI.createNewSession(userId, 'New Chat');
        
        if (data.success) {
          chatId = data.data.chatId;
          
          const newSession = {
            id: chatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date()
          };
          
          setChatSessions(prev => ({ ...prev, [chatId]: newSession }));
          setCurrentChatId(chatId);
        } else {
          throw new Error('Failed to create new chat');
        }
      } catch (error) {
        console.error('Error creating new chat:', error);
        return;
      }
    }

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    const isFirstMessage = !chatSessions[chatId]?.messages || chatSessions[chatId].messages.length === 0;
    const newTitle = isFirstMessage ? generateTitle(messageText) : chatSessions[chatId]?.title;

    // Add user message to chat
    setChatSessions(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [...(prev[chatId]?.messages || []), userMessage],
        title: newTitle
      }
    }));

    setIsLoading(true);

    try {
      const data = await chatAPI.sendMessage(messageText, chatId, userId);

      if (data.success) {
        const botResponse = {
          id: data.data.messageId,
          text: data.data.response,
          sender: 'bot',
          timestamp: new Date(data.data.timestamp),
        };

        setChatSessions(prev => ({
          ...prev,
          [chatId]: {
            ...prev[chatId],
            messages: [...(prev[chatId]?.messages || []), botResponse],
            title: data.data.title || prev[chatId]?.title || newTitle
          }
        }));

        // Update title on server for first message
        if (isFirstMessage && newTitle !== 'New Chat') {
          try {
            await chatAPI.updateChatTitle(chatId, newTitle, userId);
          } catch (titleError) {
            console.warn('Failed to update title on server:', titleError);
          }
        }
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Error: Unable to reach the server.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatSessions(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          messages: [...(prev[chatId]?.messages || []), errorResponse]
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentChatId,
    chatSessions,
    isLoading,
    isInitialized,
    selectChat,
    createNewChat,
    deleteChat,
    updateChatTitle,
    sendMessage
  };
};