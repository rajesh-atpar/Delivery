import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import styles from "./Cart.module.css";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Fresh Organic Apples",
      price: "₹99",
      quantity: 2,
      image: "https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: "₹69",
      quantity: 1,
      image: "https://plus.unsplash.com/premium_photo-1724849418331-97502da20f86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxmcmVzaCUyMHRvbWF0b3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 3,
      name: "Premium Rice 5kg",
      price: "₹259",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop"
    }
  ];

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('₹', '')) * item.quantity, 0);

  return (
    <div className={styles.cart}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Shopping Cart
            <span className={styles.highlight}> Your Items</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Review your selected items and proceed to checkout. 
            Free delivery on orders over ₹500!
          </p>
          <div className={styles.heroButtons}>
            <Link to="/products" className={styles.primaryButton}>
              Continue Shopping
            </Link>
            <Link to="/orders" className={styles.secondaryButton}>
              View Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Cart Items Section */}
      <section className={styles.cartSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Cart Items</h2>
          <p className={styles.sectionSubtitle}>{cartItems.length} items in your cart</p>
        </div>
        <div className={styles.cartItemsGrid}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItemCard}>
              <div className={styles.cartItemImage}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  loading="lazy"
                />
              </div>
              <div className={styles.cartItemInfo}>
                <h3 className={styles.cartItemName}>{item.name}</h3>
                <div className={styles.cartItemPriceRow}>
                  <span className={styles.cartItemPrice}>{item.price}</span>
                  <div className={styles.quantityControls}>
                    <button className={styles.quantityButton} aria-label="Decrease quantity">
                      <FaMinus />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button className={styles.quantityButton} aria-label="Increase quantity">
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <button className={styles.removeButton} aria-label={`Remove ${item.name}`}>
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cartSummary}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{total.toFixed(0)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span className={total > 500 ? styles.free : ""}>{total > 500 ? "Free" : "₹50"}</span>
            </div>
            <div className={styles.summaryRowTotal}>
              <span>Total</span>
              <span>₹{(total + (total > 500 ? 0 : 50)).toFixed(0)}</span>
            </div>
            <Link to="/checkout" className={styles.checkoutButton}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🚚</div>
            <h3 className={styles.benefitTitle}>Free Shipping</h3>
            <p className={styles.benefitText}>On orders over ₹500</p>
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

export default Cart;

