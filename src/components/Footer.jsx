import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Brand Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.footerLogo}>PPK</h3>
            <p className={styles.footerDescription}>
              Your trusted partner for fresh groceries and quality products. 
              We deliver excellence right to your doorstep.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/" className={styles.footerLink}>Home</Link>
              </li>
              <li>
                <Link to="/products" className={styles.footerLink}>Products</Link>
              </li>
              <li>
                <Link to="/categories" className={styles.footerLink}>Categories</Link>
              </li>
              <li>
                <Link to="/about" className={styles.footerLink}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" className={styles.footerLink}>Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Customer Service</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/orders" className={styles.footerLink}>My Orders</Link>
              </li>
              <li>
                <Link to="/cart" className={styles.footerLink}>Shopping Cart</Link>
              </li>
              <li>
                <Link to="/profile" className={styles.footerLink}>My Account</Link>
              </li>
              <li>
                <a href="#faq" className={styles.footerLink}>FAQs</a>
              </li>
              <li>
                <a href="#shipping" className={styles.footerLink}>Shipping Info</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Get in Touch</h4>
            <ul className={styles.contactInfo}>
              <li className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>123 Main Street, New York, NY 10001</span>
              </li>
              <li className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>support@ppk.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} PPK. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <span className={styles.separator}>|</span>
            <Link to="/terms" className={styles.legalLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

