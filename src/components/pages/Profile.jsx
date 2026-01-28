import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI, ordersAPI } from "../../services/api";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaShoppingBag, FaHeart, FaCog, FaSpinner } from "react-icons/fa";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile and orders
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Fetch user profile
        const profileData = await userAPI.getProfile();
        setUserData(profileData);

        // Fetch user orders
        const ordersData = await ordersAPI.getMyOrders();
        setOrders(ordersData.orders || ordersData || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data");
        // If unauthorized, logout and redirect
        if (err.message.includes("Authentication failed")) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user, logout]);

  // Calculate stats from orders
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.status === "Delivered" || order.status === "delivered").length;
  const pendingOrders = orders.filter(order => 
    order.status === "Pending" || 
    order.status === "pending" || 
    order.status === "Processing" || 
    order.status === "processing" ||
    order.status === "In Transit" ||
    order.status === "in_transit"
  ).length;

  const profileStats = [
    { label: "Total Orders", value: totalOrders.toString(), icon: FaShoppingBag },
    { label: "Delivered", value: deliveredOrders.toString(), icon: FaHeart },
    { label: "Pending", value: pendingOrders.toString(), icon: FaUser }
  ];

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

  // Format order status
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "delivered") return "#10b981";
    if (statusLower === "pending" || statusLower === "processing" || statusLower === "in transit" || statusLower === "in_transit") return "#f59e0b";
    if (statusLower === "cancelled" || statusLower === "canceled") return "#ef4444";
    return "#64748b";
  };

  if (isLoading) {
    return (
      <div className={styles.profile}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <FaSpinner style={{ fontSize: "2rem", color: "#3b82f6", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#64748b" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className={styles.profile}>
        <div style={{
          padding: "2rem",
          textAlign: "center"
        }}>
          <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</p>
          <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  // Use userData if available, otherwise fallback to user from context
  const displayUser = userData || user;
  const userName = displayUser?.first_name && displayUser?.last_name 
    ? `${displayUser.first_name} ${displayUser.last_name}`
    : displayUser?.name || displayUser?.username || "User";
  const userEmail = displayUser?.email || "N/A";
  const userPhone = displayUser?.phone || displayUser?.phone_number || "N/A";
  const userAddress = displayUser?.address || "N/A";


  return (
    <div className={styles.profile}>
      {/* Profile Header Section */}
      <section className={styles.profileHeaderSection}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              <FaUser className={styles.avatarIcon} />
            </div>
            <button className={styles.editButton}>
              <FaEdit className={styles.editIcon} />
            </button>
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{userName}</h1>
            <p className={styles.profileEmail}>{userEmail}</p>
          </div>
        </div>
      </section>

      {/* Profile Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {profileStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Icon />
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Profile Details Section */}
      <section className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>
        </div>
        <div className={styles.profileDetailsCard}>
          <div className={styles.detailItem}>
            <FaEnvelope className={styles.detailIcon} />
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Email Address</span>
              <span className={styles.detailValue}>{userEmail}</span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <FaPhone className={styles.detailIcon} />
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Phone Number</span>
              <span className={styles.detailValue}>{userPhone}</span>
            </div>
          </div>
          <div className={styles.detailItem}>
            <FaMapMarkerAlt className={styles.detailIcon} />
            <div className={styles.detailContent}>
              <span className={styles.detailLabel}>Address</span>
              <span className={styles.detailValue}>{userAddress}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Order History Section */}
      <section className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Order History</h2>
        </div>
        {orders.length > 0 ? (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id || order.order_id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderNumber}>
                      Order #{order.id || order.order_id || order.order_number || "N/A"}
                    </h3>
                    <p className={styles.orderDate}>
                      {formatDate(order.created_at || order.date || order.order_date)}
                    </p>
                  </div>
                  <div
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: `${getStatusColor(order.status)}15`,
                      color: getStatusColor(order.status)
                    }}
                  >
                    {order.status || "Pending"}
                  </div>
                </div>

                {/* Order Items */}
                <div className={styles.itemsPreview}>
                  {order.items && order.items.length > 0 ? (
                    order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className={styles.itemPreview}>
                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>
                            {item.name || item.product_name || "Item"}
                          </p>
                          <p className={styles.itemQuantity}>
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noItems}>No items found</p>
                  )}
                  {order.items && order.items.length > 3 && (
                    <p className={styles.moreItems}>
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                {/* Order Total */}
                <div className={styles.orderTotal}>
                  <span>Total Amount:</span>
                  <span className={styles.totalPrice}>
                    ₹{order.total || order.total_price || order.amount || "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FaShoppingBag className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No Orders Yet</h3>
            <p className={styles.emptyText}>Start shopping to see your orders here</p>
          </div>
        )}
      </section>

      {/* Account Settings Section */}
      <section className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Account Settings</h2>
        </div>
        <div className={styles.settingsCard}>
          <Link to="/profile/edit" className={styles.settingItem}>
            <span>Edit Profile</span>
            <FaEdit />
          </Link>
          <Link to="/profile/change-password" className={styles.settingItem}>
            <span>Change Password</span>
            <FaCog />
          </Link>
          <Link to="/profile/notifications" className={styles.settingItem}>
            <span>Notification Settings</span>
            <FaCog />
          </Link>
          <Link to="/profile/privacy" className={styles.settingItem}>
            <span>Privacy Settings</span>
            <FaCog />
          </Link>
          <Link to="/orders" className={styles.settingItem}>
            <span>My Orders</span>
            <FaShoppingBag />
          </Link>
          <button
            onClick={logout}
            className={styles.settingItem}
            style={{ cursor: "pointer", background: "none", border: "none", width: "100%", textAlign: "left" }}
          >
            <span>Logout</span>
            <FaCog />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Profile;

