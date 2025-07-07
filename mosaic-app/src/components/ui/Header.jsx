import React from 'react';
import { Menu, ChevronLeft } from 'lucide-react';

const Header = ({ 
  currentChat, 
  sidebarOpen, 
  sidebarCollapsed, 
  isMobile, 
  toggleSidebar 
}) => {
  return (
    <div className="bg-gray-800 shadow-sm border-b border-gray-700 p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors touch-manipulation"
          >
            {(isMobile && sidebarOpen) || (!isMobile && !sidebarCollapsed) ? 
              <ChevronLeft className="w-6 h-6" /> : 
              <Menu className="w-6 h-6" />
            }
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-white truncate">
              {currentChat?.title || 'Welcome'}
            </h1>
          </div>
        </div>
        
        {/* Company Branding */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-bold text-white">MOSAIC</div>
            <div className="text-sm text-gray-400">Chat</div>
          </div>
          <img src="mosaic.png" alt="Mosaic Logo" className="w-12 h-12 object-contain"/>
        </div>
      </div>
    </div>
  );
};

export default Header;