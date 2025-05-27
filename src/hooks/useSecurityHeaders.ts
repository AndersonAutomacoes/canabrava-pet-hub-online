
import { useEffect } from 'react';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Content Security Policy - permitindo acesso ao ViaCEP
    const metaCSP = document.createElement('meta');
    metaCSP.setAttribute('http-equiv', 'Content-Security-Policy');
    metaCSP.setAttribute('content', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https: blob:; " +
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; " +
      "connect-src 'self' https://srvthnemnmvpjntimgqt.supabase.co wss://srvthnemnmvpjntimgqt.supabase.co https://viacep.com.br;"
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
