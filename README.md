# Nestle-In / MOSAIC Chatbot Monorepo

This repository contains a full-stack chatbot system with multiple frontends, a Node.js/Express backend backed by MongoDB, and an AWS serverless path using API Gateway + Lambda + DynamoDB. Infrastructure-as-code is provided via CloudFormation.

- `backend`: Express API with MongoDB (Mongoose) for chat sessions and history
- `frontend`: Vite + React app with AWS Cognito auth wiring
- `mosaic-app`: Vite + React chat UI that talks to the Express backend
- `lambda`: Node.js Lambda for chatbot handling via API Gateway and DynamoDB
- `cloudformation`: CloudFormation template to provision API Gateway, Lambda, and DynamoDB

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas or local MongoDB (for `backend`)
- AWS account and AWS CLI configured (`aws configure`)

## Project Structure

```
backend/
  server.js                 # Express server entry
  routes/chat.js            # Chat routes (sessions, messages)
  models/Chat.js            # Mongoose models: User, ChatSession, Message
  config/database.js        # MongoDB connection via MONGODB_URI
frontend/
  src/lib/aws/cognito.js    # AWS Cognito User Pool config
  src/services/chatbotApi.js# Client for API Gateway + Lambda chatbot
mosaic-app/
  src/services/api.js       # Client for Express backend
lambda/
  chatbot-function.js       # Lambda handler using DynamoDB
cloudformation/
  chatbot-api.yaml          # API Gateway + Lambda + DynamoDB stack
```

## Environment Variables

Create a `.env` file in `backend/` with:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=5000
```

Frontend `.env` (for `frontend/`) to talk to API Gateway + Lambda:

```
VITE_REACT_APP_API_GATEWAY_URL=https://<api-id>.execute-api.<region>.amazonaws.com/<stage>
# If using plain create-react-app style env reading, the code uses REACT_APP_API_GATEWAY_URL
REACT_APP_API_GATEWAY_URL=https://<api-id>.execute-api.<region>.amazonaws.com/<stage>
```

Cognito config (`frontend/src/lib/aws/cognito.js`) expects:

- `UserPoolId` and `ClientId` (currently hardcoded). Update these to your pool/app client.

Lambda expects environment variables (via CloudFormation or console):

- `AWS_REGION` (defaults to `us-east-1` in code)
- `CHAT_TABLE_NAME` (defaults to `nestle-in-chat-messages`)

## Install and Run Locally

From repo root, run each app in its own terminal.

Backend (Express + MongoDB):

```
cd backend
npm install
npm run dev   # nodemon on port 5000
```

- Health check: `GET http://localhost:5000/api/health`
- Chat endpoints base: `http://localhost:5000/api/chat`

Mosaic App (talks to Express backend):

```
cd mosaic-app
npm install
npm run dev   # Vite dev server
```

Frontend (API Gateway + Lambda client):

```
cd frontend
npm install
npm run dev   # Vite dev server
```

## Backend API (Express)

Base URL: `http://localhost:5000/api`

- `POST /chat/message`
  - body: `{ message: string, chatId: string, userId?: string }`
  - response: `{ success: boolean, data: { response, chatId, timestamp, messageId } }`
- `GET /chat/history/:chatId?userId=<userId>`
  - response: `{ success: boolean, data: { chatId, title, messages, createdAt, updatedAt } }`
- `GET /chat/sessions/:userId?page=<n>&limit=<n>`
  - response: `{ success: boolean, data: { sessions, totalSessions, currentPage, totalPages } }`
- `POST /chat/session/new`
  - body: `{ userId?: string, title?: string }`
  - response: `{ success: boolean, data: { chatId, title, createdAt } }`
- `DELETE /chat/session/:chatId?userId=<userId>`
  - response: `{ success: boolean, message }`
- `PUT /chat/session/:chatId/title`
  - body: `{ title: string, userId?: string }`
  - response: `{ success: boolean, data: { chatId, title } }`

## Lambda Chatbot API (API Gateway)

`frontend/src/services/chatbotApi.js` calls the API Gateway base URL:

- Base: `${REACT_APP_API_GATEWAY_URL}/chat`
- `POST /chat`
  - body: `{ message, userId, timestamp, sessionId }`
  - response: `{ response, timestamp, sessionId }`

CORS is handled in the Lambda response headers.

## AWS Infrastructure

CloudFormation template at `cloudformation/chatbot-api.yaml` provisions:

- DynamoDB table `nestle-in-chat-messages` with TTL and GSI on `sessionId`
- IAM role for Lambda with DynamoDB access
- Lambda function `nestle-in-chatbot-<Environment>` (Node.js 18)
- API Gateway with `/chat` resource
- Deployment with stage = `Environment` parameter (default `dev`)

Outputs include the API Gateway invoke URL.

Deploy with AWS CLI:

```
aws cloudformation deploy \
  --stack-name nestle-in-chatbot-dev \
  --template-file cloudformation/chatbot-api.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides Environment=dev DynamoDBTableName=nestle-in-chat-messages
```

### Updating Lambda Code

This template uses inline code for the initial function. For real deployments, package and upload from `lambda/chatbot-function.js`:

1. Zip your handler code and dependencies
2. Upload to S3 and update the template to use `Code: S3Bucket/S3Key`, or update the function directly:

```
aws lambda update-function-code \
  --function-name nestle-in-chatbot-dev \
  --zip-file fileb://dist/lambda.zip
```

Set environment variables if needed:

```
aws lambda update-function-configuration \
  --function-name nestle-in-chatbot-dev \
  --environment Variables={CHAT_TABLE_NAME=nestle-in-chat-messages,ENVIRONMENT=dev}
```

## Frontend Configuration

- Update `frontend/src/lib/aws/cognito.js` with your `UserPoolId` and `ClientId`.
- Set `REACT_APP_API_GATEWAY_URL` (or Vite alias `VITE_REACT_APP_API_GATEWAY_URL`) to the API Gateway URL.
- `mosaic-app` uses `http://localhost:5000/api` by default; change `mosaic-app/src/services/api.js` if your backend origin differs.

## Troubleshooting

- Cannot connect to MongoDB: verify `MONGODB_URI` and that your IP is allowed in Atlas.
- 404 on `POST /api/chat/message`: ensure you created a session with `POST /api/chat/session/new` first.
- CORS errors calling API Gateway: confirm Lambda adds `Access-Control-Allow-Origin: *` and API Gateway has an `OPTIONS` method.
- 403 calling API Gateway: check if the resource/method is `AuthorizationType: NONE` or configure auth accordingly.
- Cognito errors: use correct pool region and app client ID; ensure web origins are allowed in the app client.

## License

MIT
