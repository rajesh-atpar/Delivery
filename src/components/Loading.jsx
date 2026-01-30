import { useState, useEffect } from "react";
import styles from "./Loading.module.css";
import logoImage from "../assets/Puscart logo.jpeg";

const Loading = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Check if we have cached data - if yes, skip loading screen
    const hasCachedData = localStorage.getItem("adminProducts") || localStorage.getItem("categories");
    
    if (hasCachedData) {
      // If cached data exists, show app immediately
      setIsLoading(false);
      return;
    }
    
    // Only show loading screen if no cached data (first visit)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Reduced to 0.5 seconds for first visit

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.logoContainer}>
            {!imageError ? (
              <img 
                src={logoImage} 
                alt="Puscart Logo" 
                className={styles.logoImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={styles.logoFallback}>
                <span className={styles.logoText}>P</span>
              </div>
            )}
          </div>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loading;

