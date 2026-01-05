import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt as FaMap, FaEdit, FaTimes } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profilePanelRef = useRef(null);

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

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
    if (!isProfileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Close profile panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilePanelRef.current && !profilePanelRef.current.contains(event.target)) {
        // Check if click is not on profile icon
        if (!event.target.closest(`.${styles.profileIcon}`)) {
          setIsProfileOpen(false);
          document.body.style.overflow = 'unset';
        }
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Logo Section */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>PPK</span>
          </Link>

          {/* Desktop Search Bar - Swapped position */}
          <div className={styles.desktopSearchContainer}>
            <div className={styles.desktopSearchWrapper}>
              <FaSearch className={styles.desktopSearchIcon} />
              <input
                type="text"
                placeholder="Search products..."
                className={styles.desktopSearchInput}
              />
            </div>
          </div>

          {/* Desktop Navigation Links - Swapped position */}
          <ul className={styles.desktopNavLinks}>
            <li>
              <Link to="/" className={styles.desktopNavLink}>Home</Link>
            </li>
            <li>
              <Link to="/products" className={styles.desktopNavLink}>Products</Link>
            </li>
            <li>
              <Link to="/categories" className={styles.desktopNavLink}>Categories</Link>
            </li>
            <li>
              <Link to="/about" className={styles.desktopNavLink}>About</Link>
            </li>
            <li>
              <Link to="/contact" className={styles.desktopNavLink}>Contact Us</Link>
            </li>
          </ul>

          {/* Desktop Profile Icon */}
          <button 
            onClick={handleProfileToggle}
            className={styles.profileIcon}
            aria-label="Open Profile"
          >
            <FaUser className={styles.profileIconSvg} />
          </button>

          {/* Location Section - Mobile Only */}
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

      {/* Floating Profile Panel */}
      {isProfileOpen && (
        <div className={`${styles.profilePanelOverlay} ${styles.profilePanelOpen}`}>
          <div className={styles.profilePanelBackdrop} onClick={handleProfileClose}></div>
          <div ref={profilePanelRef} className={styles.profilePanel}>
          <div className={styles.profilePanelHeader}>
            <h2 className={styles.profilePanelTitle}>My Profile</h2>
            <button 
              className={styles.profilePanelClose}
              onClick={handleProfileClose}
              aria-label="Close Profile"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.profilePanelContent}>
            {/* Profile Header */}
            <div className={styles.profilePanelHeaderSection}>
              <div className={styles.profilePanelAvatarContainer}>
                <div className={styles.profilePanelAvatar}>
                  <FaUser className={styles.profilePanelAvatarIcon} />
                </div>
                <button className={styles.profilePanelEditButton}>
                  <FaEdit className={styles.profilePanelEditIcon} />
                </button>
              </div>
              <div className={styles.profilePanelInfo}>
                <h3 className={styles.profilePanelName}>John Doe</h3>
                <p className={styles.profilePanelEmail}>john.doe@example.com</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className={styles.profilePanelDetails}>
              <div className={styles.profilePanelDetailSection}>
                <h4 className={styles.profilePanelSectionTitle}>Personal Information</h4>
                <div className={styles.profilePanelDetailCard}>
                  <div className={styles.profilePanelDetailItem}>
                    <FaUser className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Full Name</span>
                      <span className={styles.profilePanelDetailValue}>John Doe</span>
                    </div>
                  </div>
                  <div className={styles.profilePanelDetailItem}>
                    <FaEnvelope className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Email Address</span>
                      <span className={styles.profilePanelDetailValue}>john.doe@example.com</span>
                    </div>
                  </div>
                  <div className={styles.profilePanelDetailItem}>
                    <FaPhone className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Phone Number</span>
                      <span className={styles.profilePanelDetailValue}>+1 (555) 123-4567</span>
                    </div>
                  </div>
                  <div className={styles.profilePanelDetailItem}>
                    <FaMap className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Address</span>
                      <span className={styles.profilePanelDetailValue}>123 Main Street, New York, NY 10001</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.profilePanelDetailSection}>
                <h4 className={styles.profilePanelSectionTitle}>Account Settings</h4>
                <div className={styles.profilePanelDetailCard}>
                  <div className={styles.profilePanelDetailItem}>
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Account Status</span>
                      <span className={`${styles.profilePanelDetailValue} ${styles.profilePanelStatusActive}`}>Active</span>
                    </div>
                  </div>
                  <div className={styles.profilePanelDetailItem}>
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Member Since</span>
                      <span className={styles.profilePanelDetailValue}>January 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
