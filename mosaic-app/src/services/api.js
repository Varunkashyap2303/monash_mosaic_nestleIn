// services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const chatAPI = {
  // Get all chat sessions for a user
  getSessions: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${userId}`);
    return await response.json();
  },

  // Get chat history for a specific session
  getChatHistory: async (chatId, userId) => {
    const response = await fetch(`${API_BASE_URL}/chat/history/${chatId}?userId=${userId}`);
    return await response.json();
  },

  // Create a new chat session
  createNewSession: async (userId, title) => {
    const response = await fetch(`${API_BASE_URL}/chat/session/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        title: title
      }),
    });
    return await response.json();
  },

  // Delete a chat session
  deleteSession: async (chatId, userId) => {
    const response = await fetch(`${API_BASE_URL}/chat/session/${chatId}?userId=${userId}`, {
      method: 'DELETE',
    });
    return await response.json();
  },

  // Update chat title
  updateChatTitle: async (chatId, title, userId) => {
    const response = await fetch(`${API_BASE_URL}/chat/session/${chatId}/title`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        userId: userId
      }),
    });
    return await response.json();
  },

  // Send a message
  sendMessage: async (message, chatId, userId) => {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        chatId: chatId,
        userId: userId,
      }),
    });
    return await response.json();
  }
};