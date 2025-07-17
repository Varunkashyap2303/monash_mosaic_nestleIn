// AWS Lambda function for Nestle-In Chatbot
// This function handles chat messages and returns responses

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Configure AWS region
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Parse the incoming request
    const body = JSON.parse(event.body);
    const { message, userId, timestamp, sessionId } = body;
    
    // Validate input
    if (!message || !userId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({
          error: 'Missing required fields: message and userId'
        })
      };
    }
    
    // Store the message in DynamoDB (optional)
    await storeMessage(userId, sessionId, message, timestamp, 'user');
    
    // Generate bot response
    const botResponse = await generateBotResponse(message, userId);
    
    // Store bot response in DynamoDB (optional)
    await storeMessage(userId, sessionId, botResponse, new Date().toISOString(), 'bot');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        response: botResponse,
        timestamp: new Date().toISOString(),
        sessionId: sessionId
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

// Store message in DynamoDB
async function storeMessage(userId, sessionId, message, timestamp, sender) {
  const params = {
    TableName: process.env.CHAT_TABLE_NAME || 'nestle-in-chat-messages',
    Item: {
      userId: userId,
      sessionId: sessionId,
      timestamp: timestamp,
      message: message,
      sender: sender,
      ttl: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days TTL
    }
  };
  
  try {
    await dynamodb.put(params).promise();
    console.log('Message stored successfully');
  } catch (error) {
    console.error('Error storing message:', error);
    // Don't throw error as this is not critical for the main functionality
  }
}

// Generate bot response based on user message
async function generateBotResponse(message, userId) {
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword-based responses
  // You can replace this with more sophisticated AI/ML logic
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello! Welcome to Nestle-In. How can I assist you today?`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return `I'm here to help! I can assist you with:
    • Information about our services
    • Booking inquiries
    • General questions
    • Technical support
    
    What would you like to know?`;
  }
  
  if (lowerMessage.includes('booking') || lowerMessage.includes('book')) {
    return `I can help you with booking information! Currently, our booking system is being updated. Please check back soon or contact our support team for immediate assistance.`;
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return `Our pricing varies based on the service and duration. Could you please specify what type of service you're interested in?`;
  }
  
  if (lowerMessage.includes('thank')) {
    return `You're welcome! Is there anything else I can help you with?`;
  }
  
  if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return `Goodbye! Thank you for using Nestle-In. Have a great day!`;
  }
  
  // Default response for unrecognized messages
  return `I understand you said: "${message}". I'm still learning and may not have a specific response for that yet. Could you try rephrasing your question or ask me something else? I'm here to help with general inquiries, booking information, and support questions.`;
}

// Handle OPTIONS requests for CORS
exports.optionsHandler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: ''
  };
}; 