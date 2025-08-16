    import { useLocation } from 'wouter';
    import { useLayoutEffect } from 'react';

    export const ScrollToTop = () => {
      const [location] = useLocation();

      useLayoutEffect(() => {
        window.scrollTo(0, 0);
      }, [location]); // Re-run effect when pathname changes

      return null; // This component doesn't render anything visible
    };