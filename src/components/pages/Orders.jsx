import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ordersAPI } from "../../services/api";
import { FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt, FaBox, FaCheck, FaShoppingBag, FaSpinner } from "react-icons/fa";
import styles from "./Orders.module.css";

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await ordersAPI.getMyOrders();
        const ordersData = response.orders || response || [];
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format order date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      });
    } catch {
      return dateString;
    }
  };

  // Format order date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", { 
        year: "numeric", 
        month: "short", 
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "delivered") return "#10b981";
    if (statusLower === "pending" || statusLower === "processing") return "#f59e0b";
    if (statusLower === "in_transit" || statusLower === "in transit" || statusLower === "out_for_delivery") return "#3b82f6";
    if (statusLower === "cancelled" || statusLower === "canceled") return "#ef4444";
    return "#64748b";
  };

  // Generate tracking steps based on status
  const getTrackingSteps = (order) => {
    const status = order.status?.toLowerCase() || "pending";
    const orderDate = order.created_at || order.date;
    
    const steps = [
      { status: "Order Placed", completed: true, date: formatDateTime(orderDate), icon: FaCheckCircle },
      { status: "Order Confirmed", completed: status !== "pending", date: status !== "pending" ? formatDateTime(orderDate) : "Pending", icon: FaCheckCircle },
      { status: "Preparing Order", completed: ["processing", "in_transit", "in transit", "out_for_delivery", "delivered"].includes(status), date: ["processing", "in_transit", "in transit", "out_for_delivery", "delivered"].includes(status) ? formatDateTime(orderDate) : "Pending", icon: FaBox },
      { status: "Out for Delivery", completed: ["in_transit", "in transit", "out_for_delivery", "delivered"].includes(status), date: ["in_transit", "in transit", "out_for_delivery", "delivered"].includes(status) ? formatDateTime(orderDate) : "Pending", icon: FaTruck },
      { status: "Delivered", completed: status === "delivered", date: status === "delivered" ? (formatDateTime(order.updated_at || orderDate)) : "Pending", icon: FaCheckCircle }
    ];

    const currentStep = steps.findIndex(step => !step.completed);
    return { steps, currentStep: currentStep === -1 ? steps.length - 1 : currentStep };
  };

  // Separate orders into active and past
  const activeOrders = orders.filter(order => {
    const status = order.status?.toLowerCase() || "";
    return status !== "delivered" && status !== "cancelled" && status !== "canceled";
  });

  const pastOrders = orders.filter(order => {
    const status = order.status?.toLowerCase() || "";
    return status === "delivered" || status === "cancelled" || status === "canceled";
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Parse items from JSON if needed
  const parseItems = (order) => {
    if (!order.items) return [];
    if (typeof order.items === 'string') {
      try {
        return JSON.parse(order.items);
      } catch {
        return [];
      }
    }
    if (Array.isArray(order.items)) {
      return order.items;
    }
    return [];
  };

  // Render Order Card Component
  const renderOrderCard = (order, showTracking = true) => {
    const items = parseItems(order);
    const tracking = getTrackingSteps(order);
    const statusColor = getStatusColor(order.status);
    const orderNumber = order.order_number || order.orderNumber || `ORD-${order.id}`;
    const orderDate = formatDate(order.created_at || order.date);
    const totalPrice = order.total_price || order.total || order.amount || 0;
    
    return (
      <div key={order.id || order.order_id} className={styles.orderCard}>
        <div className={styles.orderHeader}>
          <div className={styles.orderInfo}>
            <h3 className={styles.orderNumber}>{orderNumber}</h3>
            <p className={styles.orderDate}>Placed on {orderDate}</p>
          </div>
          <div 
            className={styles.statusBadge}
            style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
          >
            {order.status || "Pending"}
          </div>
        </div>

        {/* Order Items Preview */}
        {items.length > 0 && (
          <div className={styles.itemsPreview}>
            {items.slice(0, 2).map((item, index) => (
              <div key={index} className={styles.itemPreview}>
                {item.image && (
                  <img src={item.image} alt={item.name || item.product_name || "Item"} className={styles.itemImage} />
                )}
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name || item.product_name || "Item"}</p>
                  <p className={styles.itemQuantity}>Qty: {item.quantity || 1}</p>
                </div>
              </div>
            ))}
            {items.length > 2 && (
              <p className={styles.moreItems}>+{items.length - 2} more items</p>
            )}
          </div>
        )}

        {/* Order Total */}
        <div className={styles.orderTotal}>
          <span>Total Amount:</span>
          <span className={styles.totalPrice}>₹{parseFloat(totalPrice).toFixed(0)}</span>
        </div>

        {/* Tracking Timeline - Only for active orders */}
        {showTracking && (
          <div className={styles.trackingSection}>
            <div className={styles.trackingHeader}>
              <FaTruck className={styles.trackingIcon} />
              <span>Order Tracking</span>
            </div>
            <div className={styles.timeline}>
              {tracking.steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = step.completed;
                const isCurrent = index === tracking.currentStep && !isCompleted;
                
                return (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineConnector}>
                      <div 
                        className={`${styles.timelineDot} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                        style={{ backgroundColor: isCompleted ? statusColor : '#e5e7eb' }}
                      >
                        {isCompleted ? <FaCheck className={styles.checkIcon} /> : <StepIcon className={styles.stepIcon} />}
                      </div>
                      {index < tracking.steps.length - 1 && (
                        <div 
                          className={styles.timelineLine}
                          style={{ backgroundColor: isCompleted ? statusColor : '#e5e7eb' }}
                        />
                      )}
                    </div>
                    <div className={styles.timelineContent}>
                      <p className={`${styles.stepStatus} ${isCompleted ? styles.completedText : ''} ${isCurrent ? styles.currentText : ''}`}>
                        {step.status}
                      </p>
                      <p className={styles.stepDate}>{step.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className={styles.deliveryInfo}>
          {order.delivery_address && (
            <div className={styles.deliveryRow}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <p className={styles.infoLabel}>{showTracking ? "Delivery Address" : "Delivered to"}</p>
                <p className={styles.infoValue}>{order.delivery_address}</p>
              </div>
            </div>
          )}
          {showTracking && order.estimated_delivery && (
            <div className={styles.deliveryRow}>
              <FaClock className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <p className={styles.infoLabel}>Estimated Delivery</p>
                <p className={styles.infoValue}>{formatDateTime(order.estimated_delivery)}</p>
              </div>
            </div>
          )}
          {!showTracking && order.updated_at && (
            <div className={styles.deliveryRow}>
              <FaCheckCircle className={styles.infoIcon} style={{ color: statusColor }} />
              <div className={styles.infoContent}>
                <p className={styles.infoLabel}>Delivered on</p>
                <p className={styles.infoValue}>{formatDateTime(order.updated_at)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Expand Button */}
        {items.length > 0 && (
          <>
            <button 
              className={styles.expandButton}
              onClick={() => toggleOrderDetails(order.id || order.order_id)}
            >
              {expandedOrder === (order.id || order.order_id) ? 'Hide Details' : 'View All Items'}
            </button>

            {/* Expanded Details */}
            {expandedOrder === (order.id || order.order_id) && (
              <div className={styles.expandedDetails}>
                <h4 className={styles.detailsTitle}>All Items</h4>
                {items.map((item, index) => (
                  <div key={index} className={styles.detailItem}>
                    {item.image && (
                      <img src={item.image} alt={item.name || item.product_name || "Item"} className={styles.detailImage} />
                    )}
                    <div className={styles.detailInfo}>
                      <p className={styles.detailName}>{item.name || item.product_name || "Item"}</p>
                      <p className={styles.detailPrice}>
                        ₹{item.price || 0} × {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={styles.orders}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.pageSubtitle}>Track and manage your orders</p>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <FaSpinner style={{ fontSize: "2rem", color: "#3b82f6", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#64748b" }}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.orders}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.pageSubtitle}>Track and manage your orders</p>
        </div>
        <div className={styles.emptyState}>
          <FaBox className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>Error Loading Orders</h3>
          <p className={styles.emptyText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orders}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>My Orders</h1>
        <p className={styles.pageSubtitle}>Track and manage your orders</p>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Active Orders</h2>
          <div className={styles.ordersList}>
            {activeOrders.map((order) => renderOrderCard(order, true))}
          </div>
        </section>
      )}

      {/* Past Orders Section */}
      {pastOrders.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Past Orders</h2>
          <div className={styles.ordersList}>
            {pastOrders.map((order) => renderOrderCard(order, false))}
          </div>
        </section>
      )}

      {/* Empty State - No Orders */}
      {activeOrders.length === 0 && pastOrders.length === 0 && !isLoading && (
        <div className={styles.emptyState}>
          <FaShoppingBag className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>You're New Here!</h3>
          <p className={styles.emptyText}>
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/products" className={styles.emptyStateButton}>
            <FaShoppingBag style={{ marginRight: "0.5rem" }} />
            Order Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
