import { Link } from "react-router-dom";
import styles from "./CategoriesPage.module.css";

const CategoriesPage = () => {
  const categories = [
    { 
      name: "Fruits", 
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop",
      description: "Fresh and organic fruits",
      count: 45
    },
    { 
      name: "Vegetables", 
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
      description: "Farm-fresh vegetables",
      count: 52
    },
    { 
      name: "Dairy", 
      image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
      description: "Fresh dairy products",
      count: 28
    },
    { 
      name: "Meat", 
      image: "https://images.unsplash.com/photo-1603048297172-c92544745067?w=400&h=400&fit=crop",
      description: "Premium quality meat",
      count: 35
    },
    { 
      name: "Grains", 
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
      description: "Whole grains and cereals",
      count: 22
    },
    { 
      name: "Beverages", 
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
      description: "Refreshing drinks",
      count: 38
    },
    { 
      name: "Snacks", 
      image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
      description: "Delicious snacks",
      count: 42
    },
    { 
      name: "Frozen Foods", 
      image: "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&h=400&fit=crop",
      description: "Frozen food products",
      count: 31
    }
  ];

  return (
    <div className={styles.categoriesPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shop by Category</h1>
          <p className={styles.subtitle}>Browse our wide range of product categories</p>
        </div>

        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/categories/${category.name.toLowerCase()}`}
              className={styles.categoryCard}
            >
              <div className={styles.categoryImageContainer}>
                <img 
                  src={category.image} 
                  alt={category.name}
                  className={styles.categoryImage}
                />
                <div className={styles.categoryOverlay}></div>
              </div>
              <div className={styles.categoryInfo}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
                <span className={styles.categoryCount}>{category.count} Products</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

