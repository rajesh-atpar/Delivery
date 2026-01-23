import { useState } from "react";
import { FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt, FaBox, FaCheck } from "react-icons/fa";
import styles from "./Orders.module.css";

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Active/Present Orders
  const activeOrders = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      date: "Jan 25, 2024",
      status: "In Transit",
      statusColor: "#3b82f6",
      total: "₹599",
      items: [
        { name: "Premium Rice 5kg", quantity: 1, price: "₹599", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop" }
      ],
      tracking: {
        currentStep: 2,
        steps: [
          { status: "Order Placed", completed: true, date: "Jan 25, 2024 10:30 AM", icon: FaCheckCircle },
          { status: "Order Confirmed", completed: true, date: "Jan 25, 2024 11:00 AM", icon: FaCheckCircle },
          { status: "Preparing Order", completed: true, date: "Jan 25, 2024 2:00 PM", icon: FaBox },
          { status: "Out for Delivery", completed: true, date: "Jan 25, 2024 4:30 PM", icon: FaTruck },
          { status: "Delivered", completed: false, date: "Expected: Jan 26, 2024", icon: FaCheckCircle }
        ]
      },
      deliveryAddress: "123 Main Street, City, State - 123456",
      estimatedDelivery: "Jan 26, 2024 by 6:00 PM"
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      date: "Jan 24, 2024",
      status: "Processing",
      statusColor: "#f59e0b",
      total: "₹899",
      items: [
        { name: "Organic Olive Oil", quantity: 1, price: "₹899", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop" }
      ],
      tracking: {
        currentStep: 1,
        steps: [
          { status: "Order Placed", completed: true, date: "Jan 24, 2024 3:15 PM", icon: FaCheckCircle },
          { status: "Order Confirmed", completed: true, date: "Jan 24, 2024 3:45 PM", icon: FaCheckCircle },
          { status: "Preparing Order", completed: false, date: "In Progress", icon: FaBox },
          { status: "Out for Delivery", completed: false, date: "Pending", icon: FaTruck },
          { status: "Delivered", completed: false, date: "Pending", icon: FaCheckCircle }
        ]
      },
      deliveryAddress: "456 Park Avenue, City, State - 789012",
      estimatedDelivery: "Jan 27, 2024 by 8:00 PM"
    }
  ];

  // Past Orders
  const pastOrders = [
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      date: "Jan 20, 2024",
      status: "Delivered",
      statusColor: "#10b981",
      total: "₹449",
      items: [
        { name: "Fresh Organic Apples", quantity: 2, price: "₹299", image: "https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { name: "Fresh Tomatoes", quantity: 1, price: "₹199", image: "https://plus.unsplash.com/premium_photo-1724849418331-97502da20f86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxmcmVzaCUyMHRvbWF0b3xlbnwwfHwwfHx8MA%3D%3D" }
      ],
      deliveredDate: "Jan 21, 2024 5:30 PM",
      deliveryAddress: "789 Oak Street, City, State - 345678"
    },
    {
      id: 4,
      orderNumber: "ORD-2024-004",
      date: "Jan 15, 2024",
      status: "Delivered",
      statusColor: "#10b981",
      total: "₹349",
      items: [
        { name: "Fresh Bananas", quantity: 2, price: "₹149", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop" },
        { name: "Fresh Carrots", quantity: 1, price: "₹129", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop" }
      ],
      deliveredDate: "Jan 16, 2024 3:15 PM",
      deliveryAddress: "321 Pine Road, City, State - 901234"
    },
    {
      id: 5,
      orderNumber: "ORD-2024-005",
      date: "Jan 10, 2024",
      status: "Delivered",
      statusColor: "#10b981",
      total: "₹249",
      items: [
        { name: "Fresh Broccoli", quantity: 1, price: "₹249", image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop" }
      ],
      deliveredDate: "Jan 11, 2024 11:45 AM",
      deliveryAddress: "654 Elm Drive, City, State - 567890"
    }
  ];

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
            {activeOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderNumber}>{order.orderNumber}</h3>
                    <p className={styles.orderDate}>Placed on {order.date}</p>
                  </div>
                  <div 
                    className={styles.statusBadge}
                    style={{ backgroundColor: `${order.statusColor}15`, color: order.statusColor }}
                  >
                    {order.status}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className={styles.itemsPreview}>
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className={styles.itemPreview}>
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className={styles.moreItems}>+{order.items.length - 2} more items</p>
                  )}
                </div>

                {/* Order Total */}
                <div className={styles.orderTotal}>
                  <span>Total Amount:</span>
                  <span className={styles.totalPrice}>{order.total}</span>
                </div>

                {/* Tracking Timeline */}
                <div className={styles.trackingSection}>
                  <div className={styles.trackingHeader}>
                    <FaTruck className={styles.trackingIcon} />
                    <span>Order Tracking</span>
                  </div>
                  <div className={styles.timeline}>
                    {order.tracking.steps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isCompleted = step.completed;
                      const isCurrent = index === order.tracking.currentStep && !isCompleted;
                      
                      return (
                        <div key={index} className={styles.timelineItem}>
                          <div className={styles.timelineConnector}>
                            <div 
                              className={`${styles.timelineDot} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                              style={{ backgroundColor: isCompleted ? order.statusColor : '#e5e7eb' }}
                            >
                              {isCompleted ? <FaCheck className={styles.checkIcon} /> : <StepIcon className={styles.stepIcon} />}
                            </div>
                            {index < order.tracking.steps.length - 1 && (
                              <div 
                                className={styles.timelineLine}
                                style={{ backgroundColor: isCompleted ? order.statusColor : '#e5e7eb' }}
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

                {/* Delivery Info */}
                <div className={styles.deliveryInfo}>
                  <div className={styles.deliveryRow}>
                    <FaMapMarkerAlt className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <p className={styles.infoLabel}>Delivery Address</p>
                      <p className={styles.infoValue}>{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className={styles.deliveryRow}>
                    <FaClock className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <p className={styles.infoLabel}>Estimated Delivery</p>
                      <p className={styles.infoValue}>{order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>

                {/* Expand Button */}
                <button 
                  className={styles.expandButton}
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrder === order.id ? 'Hide Details' : 'View All Items'}
                </button>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className={styles.expandedDetails}>
                    <h4 className={styles.detailsTitle}>All Items</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className={styles.detailItem}>
                        <img src={item.image} alt={item.name} className={styles.detailImage} />
                        <div className={styles.detailInfo}>
                          <p className={styles.detailName}>{item.name}</p>
                          <p className={styles.detailPrice}>{item.price} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Orders Section */}
      {pastOrders.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Past Orders</h2>
          <div className={styles.ordersList}>
            {pastOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderNumber}>{order.orderNumber}</h3>
                    <p className={styles.orderDate}>Placed on {order.date}</p>
                  </div>
                  <div 
                    className={styles.statusBadge}
                    style={{ backgroundColor: `${order.statusColor}15`, color: order.statusColor }}
                  >
                    {order.status}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className={styles.itemsPreview}>
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className={styles.itemPreview}>
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemInfo}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className={styles.moreItems}>+{order.items.length - 2} more items</p>
                  )}
                </div>

                {/* Order Total */}
                <div className={styles.orderTotal}>
                  <span>Total Amount:</span>
                  <span className={styles.totalPrice}>{order.total}</span>
                </div>

                {/* Delivery Info */}
                <div className={styles.deliveryInfo}>
                  <div className={styles.deliveryRow}>
                    <FaMapMarkerAlt className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <p className={styles.infoLabel}>Delivered to</p>
                      <p className={styles.infoValue}>{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className={styles.deliveryRow}>
                    <FaCheckCircle className={styles.infoIcon} style={{ color: order.statusColor }} />
                    <div className={styles.infoContent}>
                      <p className={styles.infoLabel}>Delivered on</p>
                      <p className={styles.infoValue}>{order.deliveredDate}</p>
                    </div>
                  </div>
                </div>

                {/* Expand Button */}
                <button 
                  className={styles.expandButton}
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  {expandedOrder === order.id ? 'Hide Details' : 'View All Items'}
                </button>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className={styles.expandedDetails}>
                    <h4 className={styles.detailsTitle}>All Items</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className={styles.detailItem}>
                        <img src={item.image} alt={item.name} className={styles.detailImage} />
                        <div className={styles.detailInfo}>
                          <p className={styles.detailName}>{item.name}</p>
                          <p className={styles.detailPrice}>{item.price} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {activeOrders.length === 0 && pastOrders.length === 0 && (
        <div className={styles.emptyState}>
          <FaBox className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No Orders Yet</h3>
          <p className={styles.emptyText}>Start shopping to see your orders here</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
