import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesAPI } from "../../services/api";
import { cache } from "../../utils/cache";
import styles from "./Categories.module.css";

const Categories = () => {
  // Initialize with cached data or defaults for instant display
  const getInitialCategories = () => {
    const cached = cache.get("categories");
    if (cached && cached.length > 0) {
      return cached.map(cat => ({
        ...cat,
        image: cat.image && cat.image.trim() !== "" 
          ? cat.image 
          : "https://via.placeholder.com/100?text=Category"
      }));
    }
    // Return default categories immediately
    return [
      { 
        id: "1",
        name: "Fruits", 
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop"
      },
      { 
        id: "2",
        name: "Vegetables", 
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
      },
      { 
        id: "3",
        name: "Non-Vegetables", 
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop"
      },
      { 
        id: "4",
        name: "Cereal Grains & Pulses", 
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"
      },
      { 
        id: "5",
        name: "Cleansing Products", 
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop"
      },
      { 
        id: "6",
        name: "Other Groceries", 
        image: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400&h=400&fit=crop"
      }
    ];
  };
  
  const [categories, setCategories] = useState(getInitialCategories());
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have defaults

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    // Fetch fresh data in background (non-blocking) - data already shown from initial state
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesAPI.getAllCategories();
        
        // Only update state if component is still mounted
        if (isMounted) {
          // Ensure all categories have valid image URLs
          const categoriesWithImages = categoriesData.map(cat => ({
            ...cat,
            image: cat.image && cat.image.trim() !== "" 
              ? cat.image 
              : "https://via.placeholder.com/100?text=Category"
          }));
          setCategories(categoriesWithImages);
          
          // Update cache
          cache.set("categories", categoriesWithImages);
        }
      } catch (error) {
        // Only log non-abort errors (abort errors are expected when component unmounts)
        if (error.name !== 'AbortError' && error.message !== 'signal is aborted without reason') {
          console.error("Error fetching categories:", error);
        }
        // Keep existing categories on error
      }
    };

    // Use setTimeout to make it non-blocking, but store the timeout ID
    timeoutId = setTimeout(() => {
      fetchCategories();
    }, 0);

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Categories <span className={styles.emoji}>😋</span>
        </h2>
      </div>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Link
              key={category.id || category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className={styles.categoryCard}
            >
              <div className={styles.categoryImageContainer}>
                <img 
                  src={category.image && category.image.trim() !== "" 
                    ? category.image 
                    : "https://via.placeholder.com/100?text=Category"} 
                  alt={category.name}
                  className={styles.categoryImage}
                  onError={(e) => {
                    if (e.target.src !== "https://via.placeholder.com/100?text=Category") {
                      e.target.src = "https://via.placeholder.com/100?text=Category";
                    }
                  }}
                />
              </div>
              <h3 className={styles.categoryName}>{category.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Categories;

