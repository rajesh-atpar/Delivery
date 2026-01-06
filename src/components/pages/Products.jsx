import { Link } from "react-router-dom";
import styles from "./Products.module.css";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Fresh Organic Apples",
      price: "₹99",
      image: "https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Fruits"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: "₹69",
      image: "https://plus.unsplash.com/premium_photo-1724849418331-97502da20f86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxmcmVzaCUyMHRvbWF0b3xlbnwwfHwwfHx8MA%3D%3D",
      category: "Vegetables"
    },
    {
      id: 3,
      name: "Premium Rice 5kg",
      price: "₹259",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
      category: "Grains"
    },
    {
      id: 4,
      name: "Fresh Bananas",
      price: "₹59",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
      category: "Fruits"
    },
    {
      id: 5,
      name: "Fresh Carrots",
      price: "₹49",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
      category: "Vegetables"
    },
    {
      id: 6,
      name: "Organic Olive Oil",
      price: "₹319",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
      category: "Oils"
    },
    {
      id: 7,
      name: "Fresh Strawberries",
      price: "₹119",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
      category: "Fruits"
    },
    {
      id: 8,
      name: "Fresh Broccoli",
      price: "₹79",
      image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop",
      category: "Vegetables"
    },
    {
      id: 9,
      name: "Fresh Milk 1L",
      price: "₹69",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
      category: "Dairy"
    },
    {
      id: 10,
      name: "Fresh Eggs (12 pcs)",
      price: "₹99",
      image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
      category: "Dairy"
    },
    {
      id: 11,
      name: "Chicken Breast 500g",
      price: "₹179",
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
      category: "Meat"
    },
    {
      id: 12,
      name: "Fresh Salmon 300g",
      price: "₹259",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop",
      category: "Meat"
    }
  ];

  return (
    <div className={styles.productsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Our Products</h1>
          <p className={styles.subtitle}>Browse our wide selection of fresh and quality products</p>
        </div>

        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImageWrapper}>
                <div className={styles.productImage}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productCategory}>{product.category}</span>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
