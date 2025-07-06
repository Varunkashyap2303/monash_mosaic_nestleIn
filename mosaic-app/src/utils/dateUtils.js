export const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp) => {
  const today = new Date();
  const messageDate = new Date(timestamp);
  
  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (messageDate.toDateString() === new Date(today - 86400000).toDateString()) {
    return 'Yesterday';
  } else {
    return messageDate.toLocaleDateString();
  }
};

export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const isToday = (timestamp) => {
  const today = new Date();
  const date = new Date(timestamp);
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (timestamp) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = new Date(timestamp);
  return date.toDateString() === yesterday.toDateString();
};