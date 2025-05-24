
import React, { useEffect } from 'react';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Content Security Policy
    const metaCSP = document.createElement('meta');
    metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
    metaCSP.setAttribute('content', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' https:; " +
      "connect-src 'self' https://srvthnemnmvpjntimgqt.supabase.co;"
    );
    document.head.appendChild(metaCSP);

    // X-Frame-Options
    const metaXFrame = document.createElement('meta');
    metaXFrame.setAttribute('http-equiv', 'X-Frame-Options');
    metaXFrame.setAttribute('content', 'DENY');
    document.head.appendChild(metaXFrame);

    // X-Content-Type-Options
    const metaXContent = document.createElement('meta');
    metaXContent.setAttribute('http-equiv', 'X-Content-Type-Options');
    metaXContent.setAttribute('content', 'nosniff');
    document.head.appendChild(metaXContent);

    return () => {
      document.head.removeChild(metaCSP);
      document.head.removeChild(metaXFrame);
      document.head.removeChild(metaXContent);
    };
  }, []);
};
