import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

interface AnimatedPageProps {
  children: React.ReactNode;
}

const AnimatedPage = ({ children }: AnimatedPageProps) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Reset scroll position on route change - find the closest scrollable container
    const scrollableContainer = document.querySelector('[data-scroll-container]') || 
                                 document.querySelector('.MuiBox-root[style*="overflow"]') ||
                                 window;
    
    if (scrollableContainer === window) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      (scrollableContainer as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (children !== displayChildren) {
      setIsAnimating(true);
      // Small delay to trigger fade out
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // If children haven't changed but location has, still animate
      setIsAnimating(false);
      setDisplayChildren(children);
    }
  }, [location.pathname, children, displayChildren]);

  return (
    <Box
      className="animated-page"
      sx={{
        width: "100%",
        height: "100%",
        animation: isAnimating
          ? "fadeOut 0.15s ease-out"
          : "fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "@keyframes fadeIn": {
          from: {
            opacity: 0,
            transform: "translateY(12px) scale(0.98)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
        "@keyframes fadeOut": {
          from: {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
          to: {
            opacity: 0,
            transform: "translateY(-8px) scale(0.99)",
          },
        },
        willChange: isAnimating ? "opacity, transform" : "auto",
      }}
      key={location.pathname}
    >
      {displayChildren}
    </Box>
  );
};

export default AnimatedPage;

