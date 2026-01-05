import styles from "./Profile.module.css";

const Profile = () => {
  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>Manage your account settings</p>
        <div className={styles.placeholder}>
          <p>Profile content will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

