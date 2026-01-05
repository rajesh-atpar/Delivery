import { FaTruck, FaShieldAlt, FaUsers, FaAward } from "react-icons/fa";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>About Us</h1>
          <p className={styles.heroSubtitle}>
            Your trusted partner for fresh groceries and quality products
          </p>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.textContent}>
            <h2 className={styles.sectionTitle}>Our Story</h2>
            <p className={styles.paragraph}>
              Founded with a vision to make fresh, quality groceries accessible to everyone, 
              we have been serving our community with dedication and excellence. Our commitment 
              to quality, freshness, and customer satisfaction has made us a trusted name in 
              the grocery delivery industry.
            </p>
            <p className={styles.paragraph}>
              We source our products directly from local farmers and trusted suppliers, ensuring 
              that you receive only the freshest and highest quality items. Our team works 
              tirelessly to maintain our standards and exceed your expectations with every order.
            </p>
          </div>

          <div className={styles.imageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0" 
              alt="Fresh groceries"
              className={styles.aboutImage}
            />
          </div>
        </div>

        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaTruck />
              </div>
              <h3 className={styles.featureTitle}>Fast Delivery</h3>
              <p className={styles.featureText}>
                We deliver fresh groceries to your doorstep quickly and efficiently
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaShieldAlt />
              </div>
              <h3 className={styles.featureTitle}>Quality Guaranteed</h3>
              <p className={styles.featureText}>
                Every product is carefully selected and quality-checked before delivery
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaUsers />
              </div>
              <h3 className={styles.featureTitle}>Customer First</h3>
              <p className={styles.featureText}>
                Your satisfaction is our top priority. We're here to serve you better
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaAward />
              </div>
              <h3 className={styles.featureTitle}>Award Winning</h3>
              <p className={styles.featureText}>
                Recognized for excellence in service and customer satisfaction
              </p>
            </div>
          </div>
        </div>

        <div className={styles.missionSection}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            To provide fresh, quality groceries and exceptional service that makes 
            shopping convenient and enjoyable for every customer. We believe everyone 
            deserves access to fresh, healthy food delivered right to their door.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
