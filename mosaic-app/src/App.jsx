import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Plus, MessageSquare, Trash2, Edit2, Check, X, Menu, ChevronLeft, Settings } from 'lucide-react';

const ChatBot = () => {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatSessions, setChatSessions] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile overlay
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // FIX: Create a persistent user ID that survives page refreshes
  const [userId, setUserId] = useState(null);
  const [isUserIdReady, setIsUserIdReady] = useState(false);

  // Update document title when current chat changes
  useEffect(() => {
    const currentChat = chatSessions[currentChatId];
    if (currentChat && currentChat.title) {
      document.title = `${currentChat.title} - NESTLE-IN`;
    } else {
      document.title = 'NESTLE-IN';
    }
  }, [currentChatId, chatSessions]);

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on mobile, but don't auto-expand on desktop
      if (mobile) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Initialize user ID after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let existingUserId = null;
      
      console.log('=== USER ID INITIALIZATION DEBUG ===');
      
      try {
        // Try to get existing user ID from localStorage first
        existingUserId = localStorage.getItem('mosaicUserId');
        console.log('localStorage value:', existingUserId);
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
      
      if (!existingUserId) {
        // If no localStorage, check if we have it in window (for same-tab navigation)
        existingUserId = window.mosaicUserId;
        console.log('window.mosaicUserId value:', existingUserId);
      }
      
      if (!existingUserId) {
        // Generate new user ID only if none exists
        existingUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        console.log('Generated NEW user ID:', existingUserId);
        
        try {
          // Store in localStorage for persistence across sessions
          localStorage.setItem('mosaicUserId', existingUserId);
          console.log('Saved to localStorage successfully');
          
          // Verify it was saved
          const verified = localStorage.getItem('mosaicUserId');
          console.log('Verification - localStorage now contains:', verified);
        } catch (error) {
          console.warn('Cannot save to localStorage:', error);
        }
        
        // Also store in window for immediate availability
        window.mosaicUserId = existingUserId;
      } else {
        console.log('Using EXISTING user ID:', existingUserId);
        // Make sure it's also stored in window
        window.mosaicUserId = existingUserId;
      }
      
      console.log('Final user ID:', existingUserId);
      console.log('=== END DEBUG ===');
      setUserId(existingUserId);
      setIsUserIdReady(true);
    }
  }, []);
  
  const messagesEndRef = useRef(null);
  const initializationRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSessions[currentChatId]?.messages]);

  // Load chat sessions on component mount - with race condition prevention
  useEffect(() => {
    if (!initializationRef.current && isUserIdReady && userId) {
      initializationRef.current = true;
      loadChatSessions();
    }
  }, [userId, isUserIdReady]);

  // Handle clicks outside sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && !event.target.closest('.sidebar-container') && !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
      if (editingChatId && !event.target.closest('.editing-container')) {
        cancelEditing();
      }
      if (showDeleteConfirm && !event.target.closest('.delete-confirm-container')) {
        setShowDeleteConfirm(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen, editingChatId, showDeleteConfirm]);

  const loadChatSessions = async () => {
    try {
      console.log('Loading chat sessions for user:', userId);
      const response = await fetch(`http://localhost:5000/api/chat/sessions/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data.sessions.length > 0) {
        const sessions = {};
        
        // Load full chat history for each session
        for (const session of data.data.sessions) {
          try {
            const historyResponse = await fetch(`http://localhost:5000/api/chat/history/${session.chatId}?userId=${userId}`);
            const historyData = await historyResponse.json();
            
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
        setIsInitialized(true);
      } else {
        console.log('No existing sessions found');
        setChatSessions({});
        setCurrentChatId(null);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      setChatSessions({});
      setCurrentChatId(null);
      setIsInitialized(true);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const selectChat = (chatId) => {
    setCurrentChatId(chatId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const createNewChat = async () => {
    try {
      console.log('Creating new chat session...');
      const response = await fetch('http://localhost:5000/api/chat/session/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: 'New Chat'
        }),
      });

      const data = await response.json();
      
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
        
        // Close sidebar on mobile after creating new chat
        if (isMobile) {
          setSidebarOpen(false);
        }
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/session/${chatId}?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
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
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const confirmDelete = (chatId) => {
    setShowDeleteConfirm(chatId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const startEditingTitle = (chatId, currentTitle) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const saveTitle = async (chatId) => {
    if (editingTitle.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/session/${chatId}/title`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editingTitle.trim(),
            userId: userId
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setChatSessions(prev => ({
            ...prev,
            [chatId]: {
              ...prev[chatId],
              title: editingTitle.trim()
            }
          }));
        }
      } catch (error) {
        console.error('Error updating chat title:', error);
      }
    }
    setEditingChatId(null);
    setEditingTitle('');
  };

  const cancelEditing = () => {
    setEditingChatId(null);
    setEditingTitle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    let chatId = currentChatId;

    if (!chatId) {
      try {
        console.log('Creating new chat session for message...');
        const response = await fetch('http://localhost:5000/api/chat/session/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            title: 'New Chat'
          }),
        });

        const data = await response.json();
        
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

    const generateTitle = (message) => {
      const words = message.trim().split(/\s+/);
      if (words.length === 1) return words[0];
      return words.slice(0, 3).join(' ');
    };

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    const isFirstMessage = !chatSessions[chatId]?.messages || chatSessions[chatId].messages.length === 0;
    const newTitle = isFirstMessage ? generateTitle(messageText) : chatSessions[chatId]?.title;

    setChatSessions(prev => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        messages: [...(prev[chatId]?.messages || []), userMessage],
        title: newTitle
      }
    }));

    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          chatId: chatId,
          userId: userId,
        }),
      });

      const data = await response.json();

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

        if (isFirstMessage && newTitle !== 'New Chat') {
          try {
            await fetch(`http://localhost:5000/api/chat/session/${chatId}/title`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: newTitle,
                userId: userId
              }),
            });
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

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(today - 86400000).toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const currentChat = chatSessions[currentChatId];
  const hasChats = Object.keys(chatSessions).length > 0;

  if (!isInitialized || !isUserIdReady) {
    return (
      <div className="flex h-screen w-screen bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 fixed inset-0 items-center justify-center">
        <div className="text-gray-800 text-xl font-semibold">Loading NESTLE-IN Chat...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 fixed inset-0 relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar-container bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col transition-all duration-300 z-50 shadow-lg
        ${isMobile 
          ? `fixed inset-y-0 left-0 w-80 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl`
          : `relative ${sidebarCollapsed ? 'w-0' : 'w-80'} overflow-hidden`
        }
      `}>
        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors touch-manipulation shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          {hasChats ? (
            <div className="space-y-2">
              {Object.values(chatSessions)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative p-4 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation ${
                      currentChatId === chat.id
                        ? 'bg-green-50 border border-green-200 shadow-sm'
                        : 'hover:bg-gray-50 active:bg-gray-100'
                    }`}
                    onClick={() => selectChat(chat.id)}
                  >
                    {editingChatId === chat.id ? (
                      <div className="editing-container flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="flex-1 bg-white text-gray-900 px-3 py-2 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-0"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveTitle(chat.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          autoFocus
                        />
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveTitle(chat.id);
                            }}
                            className="text-green-600 hover:text-green-700 p-2 rounded-lg touch-manipulation"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditing();
                            }}
                            className="text-red-500 hover:text-red-600 p-2 rounded-lg touch-manipulation"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 text-sm font-medium truncate mb-1">
                            {chat.title}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {formatDate(chat.createdAt)}
                          </div>
                        </div>
                        
                        <div className={`flex items-center space-x-1 flex-shrink-0 transition-opacity ${
                          isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingTitle(chat.id, chat.title);
                            }}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg touch-manipulation"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(chat.id);
                            }}
                            className="text-gray-500 hover:text-red-500 p-2 rounded-lg touch-manipulation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No chat history yet.</p>
              <p className="text-xs mt-2">Start a new conversation to begin!</p>
            </div>
          )}
        </div>

        {/* User Profile Bar */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors touch-manipulation">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-sm font-medium truncate">
                John Doe
              </div>
              <div className="text-gray-500 text-xs">
                john.doe@example.com
              </div>
            </div>
            <div className="flex-shrink-0">
              <Settings className="w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="delete-confirm-container bg-white rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-200 shadow-xl">
            <h3 className="text-gray-900 text-lg font-semibold mb-4">Delete Chat</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this chat? This action cannot be undone.</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteChat(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors touch-manipulation"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
<button
  onClick={toggleSidebar}
  className="sidebar-toggle p-2 text-green-600 hover:text-white bg-transparent hover:bg-green-600 rounded-lg transition-colors touch-manipulation border border-gray-200 focus:outline-none"
>
  {(isMobile && sidebarOpen) || (!isMobile && !sidebarCollapsed) ? 
    <ChevronLeft className="w-6 h-6" /> : 
    <Menu className="w-6 h-6" />
  }
</button>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">
                  {currentChat?.title || 'Welcome'}
                </h1>
              </div>
            </div>
            
            {/* Company Branding */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <div className="text-lg font-bold text-green-600">NESTLE-IN</div>
                <div className="text-sm text-gray-500">Chat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {currentChat?.messages?.length > 0 ? (
              currentChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-green-600 ml-2' : 'bg-gray-600 mr-2'}`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`rounded-lg px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-green-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 py-12">
                <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Welcome to NESTLE-IN Chat!</h3>
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
            )}


{/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;