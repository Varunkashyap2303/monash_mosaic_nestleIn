// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  CHAT_SESSIONS: (userId) => `/api/chat/sessions/${userId}`,
  CHAT_HISTORY: (chatId, userId) => `/api/chat/history/${chatId}?userId=${userId}`,
  NEW_SESSION: '/api/chat/session/new',
  DELETE_SESSION: (chatId, userId) => `/api/chat/session/${chatId}?userId=${userId}`,
  UPDATE_TITLE: (chatId) => `/api/chat/session/${chatId}/title`,
  SEND_MESSAGE: '/api/chat/message',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ID: 'mosaicUserId',
  CHAT_PREFERENCES: 'mosaicChatPreferences',
  THEME: 'mosaicTheme',
};

// UI Constants
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
};

export const SIDEBAR_WIDTH = {
  EXPANDED: 320, // 80 * 4 = 320px (w-80)
  COLLAPSED: 0,
};

// Message Types
export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

// Chat States
export const CHAT_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SENDING: 'sending',
  ERROR: 'error',
};

// Default Values
export const DEFAULTS = {
  CHAT_TITLE: 'New Chat',
  USER_NAME: 'John Doe',
  USER_EMAIL: 'john.doe@example.com',
  WELCOME_TITLE: 'Welcome to MOSAIC Chat!',
  ERROR_MESSAGE: 'Error: Unable to reach the server.',
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Limits
export const LIMITS = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_CHAT_TITLE_LENGTH: 100,
  MAX_CHATS_PER_USER: 100,
};