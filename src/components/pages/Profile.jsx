import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import styles from "./Profile.module.css";

const Profile = () => {
  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Profile</h1>
        <p className={styles.subtitle}>Manage your account settings and information</p>
        
        <div className={styles.profileContent}>
          {/* Profile Header */}
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
              <h2 className={styles.profileName}>John Doe</h2>
              <p className={styles.profileEmail}>john.doe@example.com</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className={styles.profileDetails}>
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              <div className={styles.detailCard}>
                <div className={styles.detailItem}>
                  <FaUser className={styles.detailIcon} />
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Full Name</span>
                    <span className={styles.detailValue}>John Doe</span>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaEnvelope className={styles.detailIcon} />
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Email Address</span>
                    <span className={styles.detailValue}>john.doe@example.com</span>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaPhone className={styles.detailIcon} />
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Phone Number</span>
                    <span className={styles.detailValue}>+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <FaMapMarkerAlt className={styles.detailIcon} />
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Address</span>
                    <span className={styles.detailValue}>123 Main Street, New York, NY 10001</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Account Settings</h3>
              <div className={styles.detailCard}>
                <div className={styles.detailItem}>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Account Status</span>
                    <span className={`${styles.detailValue} ${styles.statusActive}`}>Active</span>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Member Since</span>
                    <span className={styles.detailValue}>January 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

