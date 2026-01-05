import { Link } from "react-router-dom";
import styles from "./ProductCategories.module.css";

const ProductCategories = () => {
  const categories = [
    {
      title: "Revamp your home in style",
      items: [
        {
          image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop",
          text: "Cushion covers, bedsheets & more"
        },
        {
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
          text: "Figurines, vases & more"
        },
        {
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
          text: "Home storage"
        },
        {
          image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
          text: "Lighting solutions"
        }
      ],
      linkText: "Explore all",
      linkPath: "/home-decor"
    },
    {
      title: "Bulk order discounts + Up to 18% GST savings",
      items: [
        {
          image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
          text: "Up to 45% off | Laptops"
        },
        {
          image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=400&fit=crop",
          text: "Up to 60% off | Kitchen appliances"
        },
        {
          image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
          text: "Min. 50% off | Office furniture"
        },
        {
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          text: "Up to 60% off | for Business Purchases"
        }
      ],
      linkText: "Create a free account",
      linkPath: "/business"
    },
    {
      title: "Appliances for your home | Up to 55% off",
      items: [
        {
          image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=400&fit=crop",
          text: "Air conditioners"
        },
        {
          image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
          text: "Refrigerators"
        },
        {
          image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop",
          text: "Microwaves"
        },
        {
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          text: "Washing machines"
        }
      ],
      linkText: "See more",
      linkPath: "/appliances"
    }
  ];

  return (
    <div className={styles.productCategories}>
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className={styles.categoryColumn}>
          <h2 className={styles.categoryTitle}>{category.title}</h2>
          <div className={styles.itemsGrid}>
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className={styles.itemCard}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.text} />
                </div>
                <p className={styles.itemText}>{item.text}</p>
              </div>
            ))}
          </div>
          <Link to={category.linkPath} className={styles.exploreLink}>
            {category.linkText}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductCategories;

