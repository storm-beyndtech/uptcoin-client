// hooks/useResponsiveChatVisibility.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useResponsiveChatVisibility() {
  const location = useLocation();

  useEffect(() => {
    const chatCtn = document.getElementById('smartsupp-widget-container');

    const handleVisibility = () => {
      const isHome = location.pathname === '/';
      if (chatCtn) {
        if (window.innerWidth < 1024 && !isHome) {
          chatCtn.style.display = 'none';
        } else {
          chatCtn.style.display = 'block';
        }
      }
    };

    handleVisibility(); // run on mount
    window.addEventListener('resize', handleVisibility); // run on resize

    return () => {
      window.removeEventListener('resize', handleVisibility);
      if (chatCtn) chatCtn.style.display = 'block'; // reset on unmount
    };
  }, [location.pathname]);
}
