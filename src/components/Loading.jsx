import { useState, useEffect } from "react";
import styles from "./Loading.module.css";

const Loading = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.logoContainer}>
            <img 
              src="/vite.svg" 
              alt="Logo" 
              className={styles.logoImage}
            />
          </div>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loading;

