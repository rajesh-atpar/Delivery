import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import styles from "./Cart.module.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        try {
          const parsedItems = JSON.parse(savedCartItems);
          setCartItems(parsedItems);
        } catch (error) {
          console.error("Error parsing cart items:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCartItems();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartItems();
    };

    const handleStorageChange = (e) => {
      if (e.key === "cartItems") {
        loadCartItems();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleQuantityChange = (itemId, change) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return null; // Remove if quantity becomes 0
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item !== null); // Remove null items

    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cartItems.reduce((sum, item) => {
    try {
      const priceStr = item.price ? String(item.price).replace('₹', '').replace(',', '') : '0';
      const price = parseFloat(priceStr) || 0;
      return sum + price * (item.quantity || 1);
    } catch (error) {
      console.error("Error calculating price for item:", item, error);
      return sum;
    }
  }, 0);

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
          <p className={styles.sectionSubtitle}>
            {cartItems.length === 0 
              ? "Your cart is empty" 
              : `${cartItems.reduce((sum, item) => sum + item.quantity, 0)} item${cartItems.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <FaShoppingCart className={styles.emptyCartIcon} />
            <p className={styles.emptyCartText}>Your cart is empty</p>
            <Link to="/products" className={styles.emptyCartButton}>
              Start Shopping
            </Link>
          </div>
        ) : (
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
                    <button 
                      className={styles.quantityButton} 
                      onClick={() => handleQuantityChange(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      className={styles.quantityButton} 
                      onClick={() => handleQuantityChange(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <button 
                  className={styles.removeButton} 
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
        {cartItems.length > 0 && (
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
        )}
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

