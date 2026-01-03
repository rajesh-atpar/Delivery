import { Link } from "react-router-dom";
import styles from "./Categories.module.css";

const Categories = () => {
  const categories = [
    { 
      name: "Fruits", 
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop"
    },
    { 
      name: "vegetables", 
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
    },
    { 
      name: "Diary", 
      image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop"
    },
    { 
      name: "Meat", 
      image: "https://images.unsplash.com/photo-1603048297172-c92544745067?w=400&h=400&fit=crop"
    }
  ];

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Categories <span className={styles.emoji}>😋</span>
        </h2>
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
            </div>
            <h3 className={styles.categoryName}>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;

