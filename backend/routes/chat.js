const express = require('express');
const router = express.Router();
const { ChatSession, User } = require('../models/Chat');

// POST /api/chat/message
router.post('/message', async (req, res) => {
  try {
    const { message, chatId, userId } = req.body;
    
    // Validate required fields
    if (!message || !chatId) {
      return res.status(400).json({
        success: false,
        error: 'Message and chatId are required'
      });
    }

    // Set default userId if not provided
    const effectiveUserId = userId || 'anonymous_user';

    // Log the incoming request
    console.log('Received chat message:', {
      message,
      chatId,
      userId: effectiveUserId,
      timestamp: new Date().toISOString()
    });

    // Find or create user
    let user = await User.findOne({ userId: effectiveUserId });
    if (!user) {
      user = new User({ 
        userId: effectiveUserId,
        name: effectiveUserId === 'anonymous_user' ? 'Anonymous User' : `User ${effectiveUserId}`
      });
      await user.save();
      console.log('Created new user:', effectiveUserId);
    }

    // Update user's last active time
    user.lastActiveAt = new Date();
    await user.save();

    // Create user message
    const userMessage = {
      messageId: `msg_${Date.now()}_user`,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    // Generate bot response
    const botResponse = generateBotResponse(message);
    const botMessage = {
      messageId: `msg_${Date.now() + 1}_bot`,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    // Find existing chat session
    let chatSession = await ChatSession.findOne({ chatId, userId: effectiveUserId });
    
    if (!chatSession) {
      console.log('Chat session not found, creating new one:', chatId);
      return res.status(404).json({
        success: false,
        error: 'Chat session not found. Please create a new chat first.'
      });
    }

    // Add messages to existing session
    chatSession.messages.push(userMessage, botMessage);
    
    // Update title if this is the first real conversation (after greeting)
    if (chatSession.messages.length === 3) { // greeting + user + bot
      chatSession.title = message.length > 30 ? message.substring(0, 30) + '...' : message;
    }

    // Save the chat session
    await chatSession.save();
    console.log('Chat session saved with new messages');

    // Send response
    res.json({
      success: true,
      data: {
        response: botResponse,
        chatId,
        timestamp: botMessage.timestamp,
        messageId: botMessage.messageId
      }
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/chat/history/:chatId
router.get('/history/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;
    
    const effectiveUserId = userId || 'anonymous_user';

    console.log('Fetching chat history for:', { chatId, userId: effectiveUserId });

    // Find chat session
    const chatSession = await ChatSession.findOne({ 
      chatId, 
      userId: effectiveUserId 
    });

    if (!chatSession) {
      console.log('Chat session not found:', chatId);
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    console.log('Found chat session:', chatSession.title);

    res.json({
      success: true,
      data: {
        chatId: chatSession.chatId,
        title: chatSession.title,
        messages: chatSession.messages,
        createdAt: chatSession.createdAt,
        updatedAt: chatSession.updatedAt
      }
    });

  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/chat/sessions/:userId
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const effectiveUserId = userId || 'anonymous_user';

    console.log('Fetching chat sessions for user:', effectiveUserId);

    // Find all chat sessions for user
    const chatSessions = await ChatSession.find({ 
      userId: effectiveUserId 
    })
    .select('chatId title createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const totalSessions = await ChatSession.countDocuments({ userId: effectiveUserId });

    console.log(`Found ${chatSessions.length} chat sessions for user ${effectiveUserId}`);

    res.json({
      success: true,
      data: {
        sessions: chatSessions,
        totalSessions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSessions / limit)
      }
    });

  } catch (error) {
    console.error('Error retrieving chat sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/chat/session/new
router.post('/session/new', async (req, res) => {
  try {
    const { userId, title } = req.body;
    const effectiveUserId = userId || 'anonymous_user';
    
    console.log('Creating new chat session for user:', effectiveUserId);
    
    // Generate unique chat ID
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Find or create user
    let user = await User.findOne({ userId: effectiveUserId });
    if (!user) {
      user = new User({ 
        userId: effectiveUserId,
        name: effectiveUserId === 'anonymous_user' ? 'Anonymous User' : `User ${effectiveUserId}`
      });
      await user.save();
      console.log('Created new user:', effectiveUserId);
    }

    // Create new chat session with greeting message
    const greetingMessage = {
      messageId: `msg_${Date.now()}_bot`,
      text: "Hello! I'm your MOSAIC assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    };

    const chatSession = new ChatSession({
      chatId,
      userId: effectiveUserId,
      title: title || 'New Chat',
      messages: [greetingMessage]
    });

    await chatSession.save();
    console.log('Created new chat session:', chatId);

    res.json({
      success: true,
      data: {
        chatId,
        title: chatSession.title,
        createdAt: chatSession.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating new chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/chat/session/:chatId
router.delete('/session/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;
    
    const effectiveUserId = userId || 'anonymous_user';

    console.log('Deleting chat session:', { chatId, userId: effectiveUserId });

    const result = await ChatSession.deleteOne({ 
      chatId, 
      userId: effectiveUserId 
    });

    if (result.deletedCount === 0) {
      console.log('Chat session not found for deletion:', chatId);
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    console.log('Chat session deleted successfully:', chatId);

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/chat/session/:chatId/title
router.put('/session/:chatId/title', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title, userId } = req.body;
    
    const effectiveUserId = userId || 'anonymous_user';

    console.log('Updating chat title:', { chatId, title, userId: effectiveUserId });

    const chatSession = await ChatSession.findOneAndUpdate(
      { chatId, userId: effectiveUserId },
      { title },
      { new: true }
    );

    if (!chatSession) {
      console.log('Chat session not found for title update:', chatId);
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    console.log('Chat title updated successfully:', title);

    res.json({
      success: true,
      data: {
        chatId: chatSession.chatId,
        title: chatSession.title
      }
    });

  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Helper function to generate bot responses
function generateBotResponse(userMessage) {
  const responses = [
    `I understand you're asking about "${userMessage}". This is a response from the MOSAIC chatbot backend. How can I help you further?`,
    `Thank you for your message: "${userMessage}". I'm here to assist you with any questions or tasks you might have.`,
    `I see you mentioned "${userMessage}". That's interesting! Let me help you with that topic.`,
    `Regarding "${userMessage}" - I'm processing your request through the MOSAIC backend system. What specific information are you looking for?`,
    `Your message about "${userMessage}" has been received. I'm your MOSAIC assistant, and I'm ready to help you with whatever you need.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = router;