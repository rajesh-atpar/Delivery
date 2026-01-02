import { Link } from "react-router-dom";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo Section */}
        <Link to="/" className={styles.logo}>
          
          <span className={styles.logoText}>PPK</span>
        </Link>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIconLeft} />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton} aria-label="Search">
              Search
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ""}`}>
          <li>
            <Link to="/" className={styles.navLink}>Home</Link>
          </li>
          <li>
            <Link to="/products" className={styles.navLink}>Products</Link>
          </li>
          <li>
            <Link to="/categories" className={styles.navLink}>Categories</Link>
          </li>
          <li>
            <Link to="/about" className={styles.navLink}>About</Link>
          </li>
          <li>
            <Link to="/contact" className={styles.navLink}>Contact</Link>
          </li>
        </ul>

        {/* Right Side Icons */}
        <div className={styles.rightSection}>
          <button className={styles.iconButton} aria-label="User Account">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          
          <Link to="/cart" className={styles.cartButton} aria-label="Shopping Cart">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className={styles.cartBadge}>0</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
  );
};

export default Navbar;
