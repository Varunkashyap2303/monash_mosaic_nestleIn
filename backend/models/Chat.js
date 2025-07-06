const mongoose = require('mongoose');

// Message schema
const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Chat session schema
const chatSessionSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
chatSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// User schema for managing multiple users
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: 'Anonymous User'
  },
  email: {
    type: String,
    sparse: true // Allows null values but ensures uniqueness when set
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  ChatSession,
  User
};