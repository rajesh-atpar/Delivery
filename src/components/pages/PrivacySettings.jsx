import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft, FaUser, FaSearch, FaLock, FaEye, FaTrash } from "react-icons/fa";
import styles from "./PrivacySettings.module.css";

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowSearch: true,
    dataCollection: true,
    analytics: true,
    marketingData: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelect = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Privacy settings saved successfully!");
      navigate("/profile");
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion request submitted. We'll process it shortly.");
    }
  };

  const privacyGroups = [
    {
      title: "Profile Privacy",
      icon: FaUser,
      items: [
        {
          type: "select",
          key: "profileVisibility",
          label: "Profile Visibility",
          description: "Who can see your profile",
          options: [
            { value: "public", label: "Public" },
            { value: "friends", label: "Friends Only" },
            { value: "private", label: "Private" }
          ]
        },
        {
          type: "toggle",
          key: "showEmail",
          label: "Show Email Address",
          description: "Display your email on your profile",
          icon: FaUser
        },
        {
          type: "toggle",
          key: "showPhone",
          label: "Show Phone Number",
          description: "Display your phone number on your profile",
          icon: FaUser
        }
      ]
    },
    {
      title: "Search & Discovery",
      icon: FaSearch,
      items: [
        {
          type: "toggle",
          key: "allowSearch",
          label: "Allow Search",
          description: "Let others find you by email or phone",
          icon: FaSearch
        }
      ]
    },
    {
      title: "Data & Privacy",
      icon: FaLock,
      items: [
        {
          type: "toggle",
          key: "dataCollection",
          label: "Data Collection",
          description: "Allow us to collect data to improve your experience",
          icon: FaLock
        },
        {
          type: "toggle",
          key: "analytics",
          label: "Analytics",
          description: "Help us improve by sharing usage analytics",
          icon: FaEye
        },
        {
          type: "toggle",
          key: "marketingData",
          label: "Marketing Data",
          description: "Allow us to use your data for marketing purposes",
          icon: FaLock
        }
      ]
    }
  ];

  return (
    <div className={styles.privacySettings}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/profile" className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
        </Link>
        <h1 className={styles.pageTitle}>Privacy Settings</h1>
        <div className={styles.placeholder}></div>
      </div>

      {/* Info Card */}
      <section className={styles.infoSection}>
        <div className={styles.infoCard}>
          <FaShieldAlt className={styles.infoIcon} />
          <h2 className={styles.infoTitle}>Your Privacy Matters</h2>
          <p className={styles.infoText}>
            Control how your information is shared and used. You can change these settings at any time.
          </p>
        </div>
      </section>

      {/* Settings Sections */}
      <section className={styles.settingsSection}>
        {privacyGroups.map((group, groupIndex) => {
          const GroupIcon = group.icon;
          return (
            <div key={groupIndex} className={styles.group}>
              <div className={styles.groupHeader}>
                <GroupIcon className={styles.groupIcon} />
                <h2 className={styles.groupTitle}>{group.title}</h2>
              </div>
              <div className={styles.settingsList}>
                {group.items.map((item) => {
                  if (item.type === "toggle") {
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
                            checked={privacySettings[item.key]}
                            onChange={() => handleToggle(item.key)}
                            className={styles.toggleInput}
                          />
                          <span className={styles.toggleSlider}></span>
                        </label>
                      </div>
                    );
                  } else if (item.type === "select") {
                    return (
                      <div key={item.key} className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                          <div className={styles.settingIcon}>
                            <FaUser />
                          </div>
                          <div className={styles.settingContent}>
                            <h3 className={styles.settingLabel}>{item.label}</h3>
                            <p className={styles.settingDescription}>{item.description}</p>
                          </div>
                        </div>
                        <select
                          value={privacySettings[item.key]}
                          onChange={(e) => handleSelect(item.key, e.target.value)}
                          className={styles.select}
                        >
                          {item.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Danger Zone */}
      <section className={styles.dangerSection}>
        <div className={styles.dangerCard}>
          <div className={styles.dangerHeader}>
            <FaTrash className={styles.dangerIcon} />
            <h2 className={styles.dangerTitle}>Danger Zone</h2>
          </div>
          <p className={styles.dangerText}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button onClick={handleDeleteAccount} className={styles.deleteButton}>
            Delete Account
          </button>
        </div>
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

export default PrivacySettings;

