import React from 'react';
import { User, Settings } from 'lucide-react';

const UserProfile = ({ 
  userName = "John Doe", 
  userEmail = "john.doe@example.com" 
}) => {
  return (
    <div className="border-t border-gray-700 p-4 flex-shrink-0">
      <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-3 rounded-lg transition-colors touch-manipulation">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium truncate">
            {userName}
          </div>
          <div className="text-gray-400 text-xs">
            {userEmail}
          </div>
        </div>
        <div className="flex-shrink-0">
          <Settings className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;