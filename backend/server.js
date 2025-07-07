const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON parser instead of body-parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', require('./routes/chat'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MOSAIC Chatbot Backend is running!',
    timestamp: new Date().toISOString(),
    database: 'Connected to MongoDB'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`MOSAIC Chatbot Backend running on port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Chat Endpoint: http://localhost:${PORT}/api/chat/message`);
});