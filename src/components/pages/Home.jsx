import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styles from "./Home.module.css";

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$99.99",
      image: "🎧",
      rating: 4.5,
      discount: "20% OFF"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "$199.99",
      image: "⌚",
      rating: 4.8,
      discount: "15% OFF"
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: "$49.99",
      image: "💻",
      rating: 4.6,
      discount: "10% OFF"
    },
    {
      id: 4,
      name: "Wireless Mouse",
      price: "$29.99",
      image: "🖱️",
      rating: 4.7,
      discount: "25% OFF"
    },
    {
      id: 5,
      name: "USB-C Hub",
      price: "$39.99",
      image: "🔌",
      rating: 4.4,
      discount: "30% OFF"
    },
    {
      id: 6,
      name: "Mechanical Keyboard",
      price: "$129.99",
      image: "⌨️",
      rating: 4.9,
      discount: "12% OFF"
    }
  ];

  const categories = [
    { name: "Electronics", icon: "📱", count: 250 },
    { name: "Fashion", icon: "👕", count: 180 },
    { name: "Home & Living", icon: "🏠", count: 320 },
    { name: "Sports", icon: "⚽", count: 150 },
    { name: "Books", icon: "📚", count: 420 },
    { name: "Beauty", icon: "💄", count: 200 }
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Amazing Products
            <span className={styles.highlight}> at Unbeatable Prices</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Shop the latest trends and best deals on thousands of products. 
            Free shipping on orders over $50!
          </p>
          <div className={styles.heroButtons}>
            <Link to="/products" className={styles.primaryButton}>
              Shop Now
            </Link>
            <Link to="/categories" className={styles.secondaryButton}>
              Browse Categories
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Brands</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.floatingCard}>
            <span className={styles.cardIcon}>🛒</span>
            <p>Free Shipping</p>
          </div>
          <div className={styles.floatingCard}>
            <span className={styles.cardIcon}>⭐</span>
            <p>Top Rated</p>
          </div>
          <div className={styles.floatingCard}>
            <span className={styles.cardIcon}>🔒</span>
            <p>Secure Payment</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <p className={styles.sectionSubtitle}>Explore our wide range of product categories</p>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/categories/${category.name.toLowerCase()}`}
              className={styles.categoryCard}
            >
              <div className={styles.categoryIcon}>{category.icon}</div>
              <h3 className={styles.categoryName}>{category.name}</h3>
              <p className={styles.categoryCount}>{category.count} Products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <p className={styles.sectionSubtitle}>Handpicked items just for you</p>
        </div>
        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productBadge}>{product.discount}</div>
              <div className={styles.productImage}>{product.image}</div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.productRating}>
                  <span className={styles.stars}>
                    {"⭐".repeat(Math.floor(product.rating))}
                  </span>
                  <span className={styles.ratingText}>({product.rating})</span>
                </div>
                <div className={styles.productPriceRow}>
                  <span className={styles.productPrice}>{product.price}</span>
                  <button className={styles.addToCartButton} aria-label={`Add ${product.name} to cart`}>
                    <FaShoppingCart className={styles.cartIcon} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.viewAllContainer}>
          <Link to="/products" className={styles.viewAllButton}>
            View All Products
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🚚</div>
            <h3 className={styles.benefitTitle}>Free Shipping</h3>
            <p className={styles.benefitText}>On orders over $50</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>↩️</div>
            <h3 className={styles.benefitTitle}>Easy Returns</h3>
            <p className={styles.benefitText}>30-day return policy</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔒</div>
            <h3 className={styles.benefitTitle}>Secure Payment</h3>
            <p className={styles.benefitText}>100% secure transactions</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>💬</div>
            <h3 className={styles.benefitTitle}>24/7 Support</h3>
            <p className={styles.benefitText}>We're here to help</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
