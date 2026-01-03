import { useEffect, useState } from "react";
import styles from "./ImageCarousel.module.css";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample images - you can replace these with your actual images
  const images = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.carouselItem} ${
              index === currentIndex ? styles.active : ""
            }`}
          >
            <img src={image} alt={`Carousel ${index + 1}`} className={styles.carouselImage} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

