import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaArrowLeft, FaEnvelope, FaMobileAlt, FaShoppingBag, FaGift } from "react-icons/fa";
import styles from "./NotificationSettings.module.css";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    priceDrops: true,
    specialOffers: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Notification settings saved successfully!");
      navigate("/profile");
    }, 1000);
  };

  const notificationGroups = [
    {
      title: "General Notifications",
      icon: FaBell,
      items: [
        { key: "emailNotifications", label: "Email Notifications", description: "Receive updates via email", icon: FaEnvelope },
        { key: "pushNotifications", label: "Push Notifications", description: "Receive push notifications on your device", icon: FaMobileAlt },
        { key: "smsNotifications", label: "SMS Notifications", description: "Receive text message updates", icon: FaMobileAlt }
      ]
    },
    {
      title: "Order & Shopping",
      icon: FaShoppingBag,
      items: [
        { key: "orderUpdates", label: "Order Updates", description: "Get notified about your order status", icon: FaShoppingBag },
        { key: "promotions", label: "Promotions & Deals", description: "Receive special offers and discounts", icon: FaGift },
        { key: "newProducts", label: "New Products", description: "Be the first to know about new arrivals", icon: FaShoppingBag },
        { key: "priceDrops", label: "Price Drops", description: "Get notified when prices drop on your wishlist", icon: FaShoppingBag },
        { key: "specialOffers", label: "Special Offers", description: "Receive exclusive offers and flash sales", icon: FaGift }
      ]
    }
  ];

  return (
    <div className={styles.notificationSettings}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/profile" className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
        </Link>
        <h1 className={styles.pageTitle}>Notifications</h1>
        <div className={styles.placeholder}></div>
      </div>

      {/* Settings Sections */}
      <section className={styles.settingsSection}>
        {notificationGroups.map((group, groupIndex) => {
          const GroupIcon = group.icon;
          return (
            <div key={groupIndex} className={styles.group}>
              <div className={styles.groupHeader}>
                <GroupIcon className={styles.groupIcon} />
                <h2 className={styles.groupTitle}>{group.title}</h2>
              </div>
              <div className={styles.settingsList}>
                {group.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.key} className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <div className={styles.settingIcon}>
                          <ItemIcon />
                        </div>
                        <div className={styles.settingContent}>
                          <h3 className={styles.settingLabel}>{item.label}</h3>
                          <p className={styles.settingDescription}>{item.description}</p>
                        </div>
                      </div>
                      <label className={styles.toggle}>
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={() => handleToggle(item.key)}
                          className={styles.toggleInput}
                        />
                        <span className={styles.toggleSlider}></span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Save Button */}
      <div className={styles.buttonContainer}>
        <button
          onClick={handleSave}
          className={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;

