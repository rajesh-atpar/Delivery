import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import styles from "./Cart.module.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Categories that are sold by weight (per kg)
  const isWeightBased = (category) => {
    return ["Fruits", "Vegetables"].includes(category);
  };

  // Get increment value based on category (0.5 for weight-based, 1 for others)
  const getIncrement = (category) => {
    return isWeightBased(category) ? 0.5 : 1;
  };

  // Format quantity display (with "kg" for weight-based items)
  const formatQuantity = (item) => {
    if (isWeightBased(item.category)) {
      return `${item.quantity} kg`;
    }
    return item.quantity;
  };

  // Format price display (with "/kg" for weight-based items)
  const formatPrice = (item) => {
    const price = item.price || '₹0';
    if (isWeightBased(item.category)) {
      return `${price}/kg`;
    }
    return price;
  };

  // Merge duplicate cart entries by id (same product = one row, summed quantity)
  const mergeCartByProductId = (items) => {
    const byId = new Map();
    for (const item of items) {
      const id = item.id;
      const key = String(id);
      if (byId.has(key)) {
        const existing = byId.get(key);
        existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
      } else {
        byId.set(key, { ...item, id, quantity: item.quantity || 1 });
      }
    }
    return Array.from(byId.values());
  };

  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const savedCartItems = localStorage.getItem("cartItems");
      if (savedCartItems) {
        try {
          const parsedItems = JSON.parse(savedCartItems);
          const merged = mergeCartByProductId(parsedItems);
          setCartItems(merged);
          if (merged.length !== parsedItems.length) {
            localStorage.setItem("cartItems", JSON.stringify(merged));
          }
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

  const handleQuantityChange = (itemId, direction) => {
    const idStr = String(itemId);
    const updatedItems = cartItems
      .map((item) => {
        if (String(item.id) === idStr) {
          const increment = getIncrement(item.category);
          const change = direction > 0 ? increment : -increment;
          const newQuantity = item.quantity + change;
          const minQty = isWeightBased(item.category) ? 0.5 : 1;
          
          if (newQuantity < minQty) return null; // Remove if below minimum
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => item !== null);

    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemoveItem = (itemId) => {
    const idStr = String(itemId);
    const updatedItems = cartItems.filter((item) => String(item.id) !== idStr);
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cartItems.reduce((sum, item) => {
    try {
      const priceStr = item.price 
        ? String(item.price).replace('₹', '').replace(',', '').replace('/kg', '') 
        : '0';
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
        </div>
      </section>

      {/* Cart Items Section */}
      <section className={styles.cartSection}>
        
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
              {/* Desktop Card Layout */}
              <div className={styles.cartItemDesktop}>
                <div className={styles.cartItemImage}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cartItemInfo}>
                  <div className={styles.cartItemInfoHeader}>
                    <h3 className={styles.cartItemName}>{item.name}</h3>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                  <div className={styles.cartItemPriceRow}>
                    <span className={styles.cartItemPrice}>{formatPrice(item)}</span>
                    <div className={styles.quantityControls}>
                      <button 
                        className={styles.quantityButton} 
                        onClick={() => handleQuantityChange(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className={styles.quantity}>{formatQuantity(item)}</span>
                      <button 
                        className={styles.quantityButton} 
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Row Layout */}
              <div className={styles.cartItemRow}>
                {/* Small Product Image */}
                <div className={styles.cartItemImageSmall}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    loading="lazy"
                  />
                </div>
                
                {/* Product Info Section */}
                <div className={styles.cartItemContent}>
                  {/* Name and Remove Button Row */}
                  <div className={styles.cartItemHeader}>
                    <h3 className={styles.cartItemName}>{item.name}</h3>
                    <button 
                      className={styles.removeButtonSmall}
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  {/* Price, Quantity, and Total Row */}
                  <div className={styles.cartItemFooter}>
                    <span className={styles.cartItemPrice}>{formatPrice(item)}</span>
                    <div className={styles.quantityControls}>
                      <button 
                        className={styles.quantityButton} 
                        onClick={() => handleQuantityChange(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className={styles.quantity}>{formatQuantity(item)}</span>
                      <button 
                        className={styles.quantityButton} 
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <span className={styles.cartItemTotal}>
                      ₹{(() => {
                        try {
                          const priceStr = item.price ? String(item.price).replace('₹', '').replace(',', '').replace('/kg', '') : '0';
                          const price = parseFloat(priceStr) || 0;
                          return (price * (item.quantity || 1)).toFixed(0);
                        } catch {
                          return '0';
                        }
                      })()}
                    </span>
                  </div>
                </div>
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

