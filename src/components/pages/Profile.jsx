import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaShoppingBag, FaHeart, FaCog } from "react-icons/fa";
import styles from "./Profile.module.css";

const Profile = () => {
  const [currentLocation, setCurrentLocation] = useState("Loading location...");
  
  const profileStats = [
    { label: "Total Orders", value: "12", icon: FaShoppingBag },
    { label: "Wishlist Items", value: "5", icon: FaHeart },
    { label: "Account Status", value: "Active", icon: FaUser }
  ];

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setCurrentLocation("Location unavailable");
        return;
      }

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
              
              setCurrentLocation(locationText);
            } else if (data && data.city) {
              // Fallback to city if locality not available
              let locationText = data.city;
              if (data.principalSubdivisionCode) {
                locationText += `, ${data.principalSubdivisionCode}`;
              } else if (data.countryName) {
                locationText += `, ${data.countryName}`;
              }
              setCurrentLocation(locationText);
            } else if (data && data.countryName) {
              setCurrentLocation(data.countryName);
            } else {
              // Last resort: show coordinates
              setCurrentLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
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
                  setCurrentLocation(locationText);
                } else if (data.display_name) {
                  const parts = data.display_name.split(',');
                  setCurrentLocation(parts.length >= 2 ? `${parts[0].trim()}, ${parts[parts.length - 2].trim()}` : parts[0].trim());
                } else {
                  setCurrentLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
                }
              } else {
                setCurrentLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
              }
            } catch (fallbackError) {
              console.error("Fallback geocoding also failed:", fallbackError);
              setCurrentLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
            }
          }
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
          
          setCurrentLocation(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    };

    getCurrentLocation();
  }, []);

  return (
    <div className={styles.profile}>
      {/* Profile Header Section */}
      <section className={styles.profileHeaderSection}>
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
            <h1 className={styles.profileName}>John Doe</h1>
            <p className={styles.profileEmail}>john.doe@example.com</p>
          </div>
        </div>
      </section>

      {/* Profile Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {profileStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Icon />
                </div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Profile Details Section */}
      <section className={styles.profileSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>
        </div>
        <div className={styles.profileDetailsCard}>
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
              <span className={styles.detailValue}>{currentLocation}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Settings Section */}
      <section className={styles.settingsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Account Settings</h2>
        </div>
        <div className={styles.settingsCard}>
          <Link to="/profile/edit" className={styles.settingItem}>
            <span>Edit Profile</span>
            <FaEdit />
          </Link>
          <Link to="/profile/change-password" className={styles.settingItem}>
            <span>Change Password</span>
            <FaCog />
          </Link>
          <Link to="/profile/notifications" className={styles.settingItem}>
            <span>Notification Settings</span>
            <FaCog />
          </Link>
          <Link to="/profile/privacy" className={styles.settingItem}>
            <span>Privacy Settings</span>
            <FaCog />
          </Link>
          <Link to="/orders" className={styles.settingItem}>
            <span>My Orders</span>
            <FaShoppingBag />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Profile;

