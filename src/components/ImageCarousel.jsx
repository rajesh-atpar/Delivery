import { useEffect, useState } from "react";
import styles from "./ImageCarousel.module.css";

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Category-related images for grocery store
  const images = [
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=400&fit=crop", // Fresh Fruits
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop", // Fresh Vegetables
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=400&fit=crop", // Cereal Grains & Pulses
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=1200&h=400&fit=crop", // Non-Vegetables (Meat/Fish)
    "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1200&h=400&fit=crop" // Other Groceries
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

