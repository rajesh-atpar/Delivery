import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Payment.module.css";

const CHECKOUT_DETAILS_KEY = "checkoutDetails";

const Payment = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem(CHECKOUT_DETAILS_KEY);
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");

    if (!saved || items.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }

    setDetails(JSON.parse(saved));
    setCartItems(items);

    const subtotal = items.reduce((acc, item) => {
      const priceStr = item.price 
        ? String(item.price).replace(/₹|,|\/kg/g, "") 
        : "0";
      const price = parseFloat(priceStr) || 0;
      return acc + price * (item.quantity || 1);
    }, 0);
    const delivery = subtotal > 500 ? 0 : 50;
    setTotal(subtotal + delivery);
  }, [navigate]);

  if (!details) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Progress: Cart → Address → Payment */}
        <div className={styles.progress}>
          <div className={styles.step}>
            <span className={styles.stepDot}>1</span>
            <span className={styles.stepLabel}>Cart</span>
          </div>
          <div className={styles.stepLine} aria-hidden="true" />
          <div className={styles.step}>
            <span className={styles.stepDot}>2</span>
            <span className={styles.stepLabel}>Address</span>
          </div>
          <div className={styles.stepLine} aria-hidden="true" />
          <div className={`${styles.step} ${styles.stepActive}`}>
            <span className={styles.stepDot}>3</span>
            <span className={styles.stepLabel}>Payment</span>
          </div>
        </div>

        <h1 className={styles.title}>Payment</h1>
        <p className={styles.subtitle}>Complete your order</p>

        <div className={styles.deliveryCard}>
          <h3 className={styles.cardTitle}>Delivery to</h3>
          <p className={styles.detailLine}>{details.fullName}</p>
          <p className={styles.detailLine}>+91 {details.mobileNumber}</p>
          <p className={styles.address}>{details.deliveryAddress}</p>
        </div>

        <div className={styles.summary}>
          <h3 className={styles.cardTitle}>Order summary</h3>
          <ul className={styles.itemList}>
            {cartItems.map((item) => {
              const priceStr = item.price 
                ? String(item.price).replace(/₹|,|\/kg/g, "") 
                : "0";
              const price = parseFloat(priceStr) || 0;
              const qty = item.quantity || 1;
              const isWeightBased = ["Fruits", "Vegetables"].includes(item.category);
              const qtyDisplay = isWeightBased ? `${qty} kg` : qty;
              return (
                <li key={item.id} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.name} × {qtyDisplay}</span>
                  <span className={styles.itemPrice}>₹{(price * qty).toFixed(0)}</span>
                </li>
              );
            })}
          </ul>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
        </div>

        <p className={styles.placeholder}>
          Payment methods can be added here (e.g. card, UPI, COD).
        </p>
      </div>
    </div>
  );
};

export default Payment;
