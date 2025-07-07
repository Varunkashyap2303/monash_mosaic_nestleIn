import React, { useState } from 'react';
import { MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const ChatItem = ({ 
  chat, 
  isSelected, 
  isMobile, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(chat.title);

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingTitle(chat.title);
  };

  const handleSaveEdit = (e) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onEdit(chat.id, editingTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditingTitle(chat.title);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(chat.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSaveEdit(e);
    if (e.key === 'Escape') handleCancelEdit(e);
  };

  return (
    <div
      className={`group relative p-4 rounded-lg cursor-pointer transition-all duration-200 touch-manipulation ${
        isSelected
          ? 'bg-gray-700 border border-gray-600 shadow-sm'
          : 'hover:bg-gray-700 active:bg-gray-600'
      }`}
      onClick={() => onSelect(chat.id)}
    >
      {isEditing ? (
        <div className="editing-container flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={handleSaveEdit}
              className="text-green-400 hover:text-green-300 p-2 rounded-lg touch-manipulation"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-red-400 hover:text-red-300 p-2 rounded-lg touch-manipulation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate mb-1">
              {chat.title}
            </div>
            <div className="text-gray-400 text-xs">
              {formatDate(chat.createdAt)}
            </div>
          </div>
          
          <div className={`flex items-center space-x-1 flex-shrink-0 transition-opacity ${
            isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <button
              onClick={handleStartEdit}
              className="text-gray-400 hover:text-white p-2 rounded-lg touch-manipulation"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-400 p-2 rounded-lg touch-manipulation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatItem;