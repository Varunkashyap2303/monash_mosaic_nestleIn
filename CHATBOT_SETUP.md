# Nestle-In Chatbot Setup Guide

This guide will help you set up the chatbot functionality with AWS API Gateway and Lambda.

## Overview

The chatbot implementation includes:

- **Frontend**: React-based chat interface with real-time messaging
- **Backend**: AWS Lambda function for processing messages
- **API**: API Gateway for HTTP endpoints
- **Database**: DynamoDB for storing chat history (optional)

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS account with access to Lambda, API Gateway, and DynamoDB

## Setup Instructions

### 1. Deploy AWS Infrastructure

#### Option A: Using CloudFormation (Recommended)

1. **Deploy the CloudFormation stack:**

   ```bash
   aws cloudformation create-stack \
     --stack-name nestle-in-chatbot \
     --template-body file://cloudformation/chatbot-api.yaml \
     --parameters ParameterKey=Environment,ParameterValue=dev \
     --capabilities CAPABILITY_IAM
   ```

2. **Wait for stack creation to complete:**

   ```bash
   aws cloudformation wait stack-create-complete --stack-name nestle-in-chatbot
   ```

3. **Get the API Gateway URL:**
   ```bash
   aws cloudformation describe-stacks \
     --stack-name nestle-in-chatbot \
     --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
     --output text
   ```

#### Option B: Manual Setup

1. **Create DynamoDB Table:**

   ```bash
   aws dynamodb create-table \
     --table-name nestle-in-chat-messages \
     --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=timestamp,AttributeType=S \
     --key-schema AttributeName=userId,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
     --billing-mode PAY_PER_REQUEST
   ```

2. **Create Lambda Function:**

   - Upload the `lambda/chatbot-function.js` file
   - Set runtime to Node.js 18.x
   - Configure environment variables:
     - `CHAT_TABLE_NAME`: nestle-in-chat-messages
     - `ENVIRONMENT`: dev

3. **Create API Gateway:**
   - Create a new REST API
   - Add a POST method for `/chat`
   - Integrate with your Lambda function
   - Enable CORS

### 2. Update Frontend Configuration

1. **Set the API Gateway URL in your environment:**
   Create a `.env` file in the `frontend` directory:

   ```env
   REACT_APP_API_GATEWAY_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/dev
   ```

2. **Update the API service:**
   In `frontend/src/services/chatbotApi.js`, replace the placeholder URL with your actual API Gateway URL.

### 3. Test the Implementation

1. **Start the frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

2. **Test the chatbot:**
   - Log in to the application
   - Navigate to the chatbot page
   - Send a test message
   - Verify the response from the Lambda function

## API Endpoints

### POST /chat

Send a message to the chatbot.

**Request Body:**

```json
{
  "message": "Hello, how can you help me?",
  "userId": "user123",
  "timestamp": "2024-01-01T12:00:00Z",
  "sessionId": "session_1234567890"
}
```

**Response:**

```json
{
  "response": "Hello! Welcome to Nestle-In. How can I assist you today?",
  "timestamp": "2024-01-01T12:00:01Z",
  "sessionId": "session_1234567890"
}
```

## Customization

### Adding More Bot Responses

Edit the `generateBotResponse` function in `lambda/chatbot-function.js`:

```javascript
async function generateBotResponse(message, userId) {
  const lowerMessage = message.toLowerCase();

  // Add your custom responses here
  if (lowerMessage.includes("your-keyword")) {
    return "Your custom response here";
  }

  // Default response
  return "Default response for unrecognized messages";
}
```

### Integrating with AI Services

You can enhance the chatbot by integrating with:

- **Amazon Lex**: For natural language understanding
- **OpenAI GPT**: For advanced conversational AI
- **Amazon Bedrock**: For foundation models

Example with OpenAI:

```javascript
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateBotResponse(message, userId) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for Nestle-In.",
        },
        { role: "user", content: message },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm sorry, I'm having trouble processing your request right now.";
  }
}
```

### Adding Authentication

To secure the API endpoints:

1. **Add API Gateway Authorizer:**

   ```yaml
   # In your CloudFormation template
   Authorizer:
     Type: AWS::ApiGateway::Authorizer
     Properties:
       Name: CognitoAuthorizer
       Type: COGNITO_USER_POOLS
       IdentitySource: method.request.header.Authorization
       RestApiId: !Ref ChatbotApi
       ProviderARNs:
         - !Ref UserPoolArn
   ```

2. **Update the Lambda function to verify tokens:**

   ```javascript
   const jwt = require("jsonwebtoken");

   // Verify JWT token
   function verifyToken(token) {
     // Add your JWT verification logic here
   }
   ```

## Monitoring and Logging

### CloudWatch Logs

Lambda function logs are automatically sent to CloudWatch. Monitor them for:

- Function execution times
- Error rates
- Custom metrics

### DynamoDB Metrics

Monitor DynamoDB for:

- Read/Write capacity
- Throttling events
- Storage usage

## Cost Optimization

- **DynamoDB**: Use PAY_PER_REQUEST billing for development
- **Lambda**: Monitor execution times and memory usage
- **API Gateway**: Consider caching for frequently accessed responses

## Troubleshooting

### Common Issues

1. **CORS Errors:**

   - Ensure API Gateway CORS is properly configured
   - Check that the frontend URL is allowed

2. **Lambda Timeout:**

   - Increase the timeout in Lambda configuration
   - Optimize the response generation logic

3. **DynamoDB Errors:**
   - Verify IAM permissions
   - Check table name and schema

### Debug Mode

Enable debug logging in the Lambda function:

```javascript
console.log("Event:", JSON.stringify(event, null, 2));
console.log("User ID:", userId);
console.log("Message:", message);
```

## Security Considerations

1. **Input Validation**: Always validate user input
2. **Rate Limiting**: Implement API Gateway throttling
3. **Data Encryption**: Enable encryption at rest for DynamoDB
4. **Access Control**: Use IAM roles with minimal permissions

## Next Steps

1. **Deploy to Production**: Update environment variables and deploy
2. **Add Analytics**: Track user interactions and bot performance
3. **Implement Feedback**: Add user feedback mechanisms
4. **Scale Up**: Consider using Amazon Lex for more advanced NLP

## Support

For issues or questions:

1. Check CloudWatch logs for errors
2. Verify API Gateway configuration
3. Test Lambda function directly in AWS Console
4. Review IAM permissions and roles
