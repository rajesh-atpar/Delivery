import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styles from "./Home.module.css";

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Fresh Organic Apples",
      price: "$4.99",
      image: "https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      discount: "15% OFF"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: "$3.49",
      image: "https://plus.unsplash.com/premium_photo-1724849418331-97502da20f86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxmcmVzaCUyMHRvbWF0b3xlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.7,
      discount: "20% OFF"
    },
    {
      id: 3,
      name: "Premium Rice 5kg",
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
      rating: 4.9,
      discount: "10% OFF"
    },
    {
      id: 4,
      name: "Fresh Bananas",
      price: "$2.99",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
      rating: 4.6,
      discount: "25% OFF"
    },
    {
      id: 5,
      name: "Fresh Carrots",
      price: "$2.49",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
      rating: 4.8,
      discount: "18% OFF"
    },
    {
      id: 6,
      name: "Organic Olive Oil",
      price: "$15.99",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
      rating: 4.9,
      discount: "12% OFF"
    },
    {
      id: 7,
      name: "Fresh Strawberries",
      price: "$5.99",
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
      rating: 4.7,
      discount: "22% OFF"
    },
    {
      id: 8,
      name: "Fresh Broccoli",
      price: "$3.99",
      image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop",
      rating: 4.6,
      discount: "15% OFF"
    }
  ];


  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Fresh Groceries Delivered
            <span className={styles.highlight}> to Your Doorstep</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Shop fresh fruits, vegetables, and groceries with the best quality and prices. 
            Free delivery on orders over $50!
          </p>
          <div className={styles.heroButtons}>
            <Link to="/products" className={styles.primaryButton}>
              Shop Now
            </Link>
            <Link to="/categories" className={styles.secondaryButton}>
              Browse Categories
            </Link>
          </div>
          <div className={styles.offersSection}>
            <div className={styles.offerCard} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)'}}>
              <div className={styles.offerOverlay}></div>
              <div className={styles.offerBadge}>FLAT</div>
              <div className={styles.offerContent}>
                <div className={styles.offerDiscount}>20% OFF</div>
                <div className={styles.offerText}>On First Order</div>
                <div className={styles.offerCode}>Use Code: FIRST20</div>
              </div>
            </div>
            <div className={styles.offerCard} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)'}}>
              <div className={styles.offerOverlay}></div>
              <div className={styles.offerBadge}>UPTO</div>
              <div className={styles.offerContent}>
                <div className={styles.offerDiscount}>50% OFF</div>
                <div className={styles.offerText}>On Fresh Fruits</div>
                <div className={styles.offerCode}>Use Code: FRUIT50</div>
              </div>
            </div>
            <div className={styles.offerCard} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)'}}>
              <div className={styles.offerOverlay}></div>
              <div className={styles.offerBadge}>FLAT</div>
              <div className={styles.offerContent}>
                <div className={styles.offerDiscount}>₹100 OFF</div>
                <div className={styles.offerText}>On Orders Above ₹500</div>
                <div className={styles.offerCode}>Use Code: SAVE100</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
        </div>
      </section>


      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <p className={styles.sectionSubtitle}>Fresh and quality products selected for you</p>
        </div>
        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productBadge}>{product.discount}</div>
              <div className={styles.productImage}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                />
              </div>
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
