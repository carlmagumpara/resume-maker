import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();
  const previousLocation = location.state?.previousLocation;

  useEffect(() => {
    if (!location.pathname.includes('/modal/')) {
      const canControlScrollRestoration = 'scrollRestoration' in window.history;

      if (canControlScrollRestoration) {
        window.history.scrollRestoration = 'manual';
      }

      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
  
  return null;
}