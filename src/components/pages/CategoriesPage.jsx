import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./CategoriesPage.module.css";

const CategoriesPage = () => {
  const { categoryName } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // All products data
  const allProducts = [
    {
      id: 1,
      name: "Fresh Organic Apples",
      price: "₹99",
      image: "https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Fruits"
    },
    {
      id: 4,
      name: "Fresh Bananas",
      price: "₹59",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
      category: "Fruits"
    },
    {
      id: 7,
      name: "Fresh Strawberries",
      price: "₹119",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
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
      id: 5,
      name: "Fresh Carrots",
      price: "₹49",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
      category: "Vegetables"
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
    },
    {
      id: 3,
      name: "Premium Rice 5kg",
      price: "₹259",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
      category: "Grains"
    },
    {
      id: 6,
      name: "Organic Olive Oil",
      price: "₹319",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
      category: "Oils"
    }
  ];

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
    }
  ];

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? allProducts.filter(product => product.category === selectedCategory)
    : [];

  return (
    <div className={styles.categoriesPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shop by Category</h1>
          <p className={styles.subtitle}>Browse our wide range of product categories</p>
        </div>

        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${styles.categoryCard} ${selectedCategory === category.name ? styles.categoryCardActive : ''}`}
              onClick={() => handleCategoryClick(category.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(category.name);
                }
              }}
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
            </div>
          ))}
        </div>

        {/* Filtered Products Section - Only show on laptop when category is selected */}
        {selectedCategory && (
          <div id="products-section" className={styles.productsSection}>
            <div className={styles.productsHeader}>
              <h2 className={styles.productsTitle}>
                {selectedCategory} Products
                <button 
                  className={styles.clearFilterButton}
                  onClick={() => setSelectedCategory(null)}
                  aria-label="Clear filter"
                >
                  ×
                </button>
              </h2>
              <p className={styles.productsSubtitle}>
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} in {selectedCategory}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={styles.filteredProductsGrid}>
                {filteredProducts.map((product) => (
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
            ) : (
              <div className={styles.noProducts}>
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;

