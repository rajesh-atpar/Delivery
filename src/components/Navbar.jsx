import { Link } from "react-router-dom";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo Section */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>PPK</span>
          </Link>

          {/* Location Section */}
          <div className={styles.locationContainer}>
            <FaMapMarkerAlt className={styles.locationIcon} />
            <span className={styles.locationText}>New York, NY</span>
          </div>

          {/* Right Side Icons */}
          <div className={styles.rightSection}>
            {/* Mobile Menu Toggle */}
            <button
              className={styles.menuToggle}
              onClick={handleMenuToggle}
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              <span className={isMenuOpen ? styles.hamburgerOpen : styles.hamburger}></span>
              <span className={isMenuOpen ? styles.hamburgerOpen : styles.hamburger}></span>
              <span className={isMenuOpen ? styles.hamburgerOpen : styles.hamburger}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <div className={`${styles.fullScreenMenu} ${isMenuOpen ? styles.menuOpen : ""}`}>
        <div className={styles.menuContent}>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" className={styles.navLink} onClick={handleLinkClick}>Home</Link>
            </li>
            <li>
              <Link to="/products" className={styles.navLink} onClick={handleLinkClick}>Products</Link>
            </li>
            <li>
              <Link to="/categories" className={styles.navLink} onClick={handleLinkClick}>Categories</Link>
            </li>
            <li>
              <Link to="/about" className={styles.navLink} onClick={handleLinkClick}>About</Link>
            </li>
            <li>
              <Link to="/contact" className={styles.navLink} onClick={handleLinkClick}>Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
