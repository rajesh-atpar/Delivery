import { Link } from "react-router-dom";
import styles from "./ProductCategories.module.css";

const ProductCategories = () => {
  const categories = [
    {
      title: "Fresh Vegetables",
      items: [
        {
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
          text: "Bell Peppers & Capsicum"
        },
        {
          image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
          text: "Carrots & Root Vegetables"
        },
        {
          image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop",
          text: "Broccoli & Cauliflower"
        },
        {
          image: "https://images.unsplash.com/photo-1603048297172-c92544745067?w=400&h=400&fit=crop",
          text: "Leafy Greens & More"
        }
      ],
      linkText: "Explore all",
      linkPath: "/categories/vegetables"
    },
    {
      title: "Staples & Groceries",
      items: [
        {
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
          text: "Rice & Grains"
        },
        {
          image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
          text: "Cooking Oils"
        },
        {
          image: "https://images.unsplash.com/photo-1551892584-5b5c0e5b8b5b?w=400&h=400&fit=crop",
          text: "Pulses & Lentils"
        },
        {
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
          text: "Flour & Atta"
        }
      ],
      linkText: "See more",
      linkPath: "/categories/staples"
    },
    {
      title: "Dairy Products",
      items: [
        {
          image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
          text: "Fresh Milk"
        },
        {
          image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
          text: "Yogurt & Curd"
        },
        {
          image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
          text: "Cheese & Butter"
        },
        {
          image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
          text: "Paneer & More"
        }
      ],
      linkText: "Explore all",
      linkPath: "/categories/dairy"
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

