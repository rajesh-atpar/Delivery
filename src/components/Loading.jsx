import { useState, useEffect } from "react";
import styles from "./Loading.module.css";
import logoImage from "../assets/Puscart logo.jpeg";

const Loading = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Your Ultimate Shopping Destination";

  useEffect(() => {
    // Typing animation
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 70); // Type each character every 100ms

    // Show loading screen for longer duration to allow typing animation to complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // Show loading screen for 5 seconds to allow typing animation

    return () => {
      clearTimeout(timer);
      clearInterval(typingInterval);
    };
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
          <div className={styles.typingText}>
            {displayedText}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loading;

