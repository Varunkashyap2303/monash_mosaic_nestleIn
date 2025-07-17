# Frontend

This is the frontend application for Nestle-In, a smart living hub with booking and chatbot functionality.

## Features

- **User Authentication**: Secure login/signup with AWS Cognito
- **Pod Booking**: Book sleeping pods with location tracking
- **Interactive Maps**: OpenStreetMap integration to show pod locations
- **AI Chatbot**: Intelligent assistant powered by AWS Lambda
- **Responsive Design**: Modern UI with Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+ installed
- AWS Cognito configuration

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables (optional):
   Create a `.env` file in the frontend directory with:

   ```
   REACT_APP_API_GATEWAY_URL=your_api_gateway_url_here
   ```

   Note: No API key is required for maps - we use free OpenStreetMap data!

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Sign up/Login**: Create an account or sign in with existing credentials
2. **Book a Pod**: Navigate to "Book Pod" to select and book a sleeping pod
3. **View Location**: After booking, see your pod's location on an interactive map
4. **Chat with AI**: Use the chatbot for assistance and information

## Map Features

- Interactive OpenStreetMap showing pod locations
- Click markers to see pod details
- Responsive design that works on all devices
- Real-time location data for booked accommodations
- Completely free - no API key required

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- OpenStreetMap (Leaflet)
- AWS Cognito
- React Router DOM
