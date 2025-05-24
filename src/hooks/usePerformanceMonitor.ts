
import { useEffect } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      if (loadTime > 100) { // Log components that take more than 100ms
        console.warn(`⚠️ Performance: ${componentName} took ${loadTime.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
};
