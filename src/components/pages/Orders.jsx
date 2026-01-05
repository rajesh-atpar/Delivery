import styles from "./Orders.module.css";

const Orders = () => {
  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.subtitle}>Your order history will appear here</p>
        <div className={styles.placeholder}>
          <p>No orders yet</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;

