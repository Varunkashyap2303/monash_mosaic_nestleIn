// Chatbot API service for communicating with API Gateway
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'YOUR_API_GATEWAY_ENDPOINT';

export const chatbotApi = {
  // Send a message to the chatbot and get a response
  sendMessage: async (message, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers for authentication/authorization
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message,
          userId: userId,
          timestamp: new Date().toISOString(),
          sessionId: sessionStorage.getItem('chatSessionId') || generateSessionId()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chatbot API error:', error);
      throw error;
    }
  },

  // Get chat history for a user
  getChatHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat history API error:', error);
      throw error;
    }
  },

  // Clear chat history for a user
  clearChatHistory: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Clear chat history API error:', error);
      throw error;
    }
  }
};

// Generate a unique session ID
function generateSessionId() {
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem('chatSessionId', sessionId);
  return sessionId;
}

// Export default for convenience
export default chatbotApi; 