import { useState, useEffect } from 'react';

export const useUserId = () => {
  const [userId, setUserId] = useState(null);
  const [isUserIdReady, setIsUserIdReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let existingUserId = null;
      
      console.log('=== USER ID INITIALIZATION DEBUG ===');
      
      try {
        // Try to get existing user ID from localStorage first
        existingUserId = localStorage.getItem('mosaicUserId');
        console.log('localStorage value:', existingUserId);
      } catch (error) {
        console.warn('localStorage not available:', error);
      }
      
      if (!existingUserId) {
        // If no localStorage, check if we have it in window (for same-tab navigation)
        existingUserId = window.mosaicUserId;
        console.log('window.mosaicUserId value:', existingUserId);
      }
      
      if (!existingUserId) {
        // Generate new user ID only if none exists
        existingUserId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        console.log('Generated NEW user ID:', existingUserId);
        
        try {
          // Store in localStorage for persistence across sessions
          localStorage.setItem('mosaicUserId', existingUserId);
          console.log('Saved to localStorage successfully');
          
          // Verify it was saved
          const verified = localStorage.getItem('mosaicUserId');
          console.log('Verification - localStorage now contains:', verified);
        } catch (error) {
          console.warn('Cannot save to localStorage:', error);
        }
        
        // Also store in window for immediate availability
        window.mosaicUserId = existingUserId;
      } else {
        console.log('Using EXISTING user ID:', existingUserId);
        // Make sure it's also stored in window
        window.mosaicUserId = existingUserId;
      }
      
      console.log('Final user ID:', existingUserId);
      console.log('=== END DEBUG ===');
      setUserId(existingUserId);
      setIsUserIdReady(true);
    }
  }, []);

  return { userId, isUserIdReady };
};