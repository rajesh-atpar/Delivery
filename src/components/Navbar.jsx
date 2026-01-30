import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaMapMarkerAlt, FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt as FaMap, FaEdit, FaTimes, FaShoppingBag } from "react-icons/fa";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [location, setLocation] = useState("Getting location...");
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const profilePanelRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

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
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
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

  // Function to get and format user's current location
  const getCurrentLocation = (useCache = true) => {
    if (!navigator.geolocation) {
      setLocation("Location unavailable");
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use BigDataCloud API (supports CORS, no API key needed)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location');
          }
          
          const data = await response.json();
          
          if (data && data.locality) {
            let locationText = data.locality;
            
            // Add state/province or country
            if (data.principalSubdivision) {
              locationText += `, ${data.principalSubdivision}`;
            } else if (data.countryName) {
              locationText += `, ${data.countryName}`;
            }
            
            setLocation(locationText);
          } else if (data && data.city) {
            // Fallback to city if locality not available
            let locationText = data.city;
            if (data.principalSubdivisionCode) {
              locationText += `, ${data.principalSubdivisionCode}`;
            } else if (data.countryName) {
              locationText += `, ${data.countryName}`;
            }
            setLocation(locationText);
          } else if (data && data.countryName) {
            setLocation(data.countryName);
          } else {
            // Last resort: show coordinates
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          // Try alternative geocoding service as fallback (using CORS proxy)
          try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`)}`;
            const altResponse = await fetch(proxyUrl);
            const proxyData = await altResponse.json();
            const data = JSON.parse(proxyData.contents);
            
            if (data && data.address) {
              const address = data.address;
              let locationText = "";
              
              if (address.city) {
                locationText = address.city;
              } else if (address.town) {
                locationText = address.town;
              } else if (address.village) {
                locationText = address.village;
              } else if (address.suburb) {
                locationText = address.suburb;
              } else if (address.county) {
                locationText = address.county;
              }
              
              if (locationText && address.state) {
                locationText += `, ${address.state}`;
              } else if (locationText && address.country) {
                locationText += `, ${address.country}`;
              } else if (!locationText && address.state) {
                locationText = address.state;
              } else if (!locationText && address.country) {
                locationText = address.country;
              }
              
              if (locationText) {
                setLocation(locationText);
              } else if (data.display_name) {
                const parts = data.display_name.split(',');
                setLocation(parts.length >= 2 ? `${parts[0].trim()}, ${parts[parts.length - 2].trim()}` : parts[0].trim());
              } else {
                setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
              }
            } else {
              setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            }
          } catch (fallbackError) {
            console.error("Fallback geocoding also failed:", fallbackError);
            setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
          }
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Location unavailable";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location timeout";
            break;
        }
        
        setLocation(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: useCache ? 300000 : 0 // Cache for 5 minutes or don't use cache
      }
    );
  };

  // Get user's current location on component mount
  useEffect(() => {
    getCurrentLocation(true);
  }, []);

  // Handle location refresh on click
  const handleLocationClick = () => {
    getCurrentLocation(false);
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
            <img 
              src="/src/assets/Puscart logo.jpeg" 
              alt="Puscart Logo" 
              className={styles.logoImage}
            />
          </Link>

          {/* Desktop Search Bar - Swapped position */}
          <div className={styles.desktopSearchContainer}>
            <form 
              className={styles.desktopSearchWrapper}
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery("");
                }
              }}
            >
              <FaSearch className={styles.desktopSearchIcon} />
              <input
                type="text"
                placeholder="Search products..."
                className={styles.desktopSearchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery("");
                  }
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </form>
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
          <div className={styles.locationContainer} onClick={handleLocationClick} title="Tap to refresh location">
            <FaMapMarkerAlt className={styles.locationIcon} />
            <span className={styles.locationText}>
              {isLoadingLocation ? "Getting location..." : location}
            </span>
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

      {/* Floating Sidebar Menu */}
      <div className={`${styles.fullScreenMenu} ${isMenuOpen ? styles.menuOpen : ""}`}>
        <div className={styles.menuBackdrop} onClick={handleLinkClick}></div>
        <div className={styles.menuContent}>
          <div className={styles.menuHeader}>
            <Link to="/" className={styles.menuLogo} onClick={handleLinkClick}>
              <img 
                src="/src/assets/Puscart logo.jpeg" 
                alt="Puscart Logo" 
                className={styles.menuLogoImage}
              />
            </Link>
            <button 
              className={styles.menuCloseButton}
              onClick={handleLinkClick}
              aria-label="Close Menu"
            >
              <FaTimes />
            </button>
          </div>
          <nav className={styles.menuNav}>
            <ul className={styles.navLinks}>
              <li>
                <Link to="/" className={styles.navLink} onClick={handleLinkClick}>
                  <span className={styles.navLinkText}>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className={styles.navLink} onClick={handleLinkClick}>
                  <span className={styles.navLinkText}>Products</span>
                </Link>
              </li>
              <li>
                <Link to="/categories" className={styles.navLink} onClick={handleLinkClick}>
                  <span className={styles.navLinkText}>Categories</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className={styles.navLink} onClick={handleLinkClick}>
                  <span className={styles.navLinkText}>About</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className={styles.navLink} onClick={handleLinkClick}>
                  <span className={styles.navLinkText}>Contact</span>
                </Link>
              </li>
            </ul>
          </nav>
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
                <h3 className={styles.profilePanelName}>
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.name || user?.username || "User"}
                </h3>
                <p className={styles.profilePanelEmail}>{user?.email || "N/A"}</p>
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
                      <span className={styles.profilePanelDetailValue}>
                        {user?.first_name && user?.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user?.name || user?.username || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.profilePanelDetailItem}>
                    <FaEnvelope className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Email Address</span>
                      <span className={styles.profilePanelDetailValue}>{user?.email || "N/A"}</span>
                    </div>
                  </div>
                  <div className={styles.profilePanelDetailItem}>
                    <FaPhone className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Phone Number</span>
                      <span className={styles.profilePanelDetailValue}>
                        {user?.phone || user?.phone_number || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.profilePanelDetailItem}>
                    <FaMap className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>Address</span>
                      <span className={styles.profilePanelDetailValue}>
                        {user?.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.profilePanelDetailSection}>
                <h4 className={styles.profilePanelSectionTitle}>Quick Actions</h4>
                <div className={styles.profilePanelDetailCard}>
                  <Link 
                    to="/profile" 
                    className={styles.profilePanelActionLink}
                    onClick={handleProfileClose}
                  >
                    <FaUser className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>View Full Profile</span>
                    </div>
                  </Link>
                  <Link 
                    to="/orders" 
                    className={styles.profilePanelActionLink}
                    onClick={handleProfileClose}
                  >
                    <FaShoppingBag className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel}>My Orders</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      handleProfileClose();
                      navigate("/");
                    }}
                    className={styles.profilePanelActionLink}
                    style={{ border: "none", background: "none", width: "100%", textAlign: "left", cursor: "pointer", padding: 0 }}
                  >
                    <FaEdit className={styles.profilePanelDetailIcon} />
                    <div className={styles.profilePanelDetailContent}>
                      <span className={styles.profilePanelDetailLabel} style={{ color: "#dc2626" }}>Logout</span>
                    </div>
                  </button>
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
