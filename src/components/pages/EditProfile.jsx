import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaCamera } from "react-icons/fa";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load user data from Supabase on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const profileData = await userAPI.getProfile();
        
        // Split full name if it exists, or use first_name/last_name
        const firstName = profileData.first_name || "";
        const lastName = profileData.last_name || "";
        
        setFormData({
          first_name: firstName,
          last_name: lastName,
          email: profileData.email || "",
          phone: profileData.phone || profileData.phone_number || "",
          address: profileData.address || ""
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        // If error, use data from context
        if (user) {
          const firstName = user.first_name || "";
          const lastName = user.last_name || "";
          setFormData({
            first_name: firstName,
            last_name: lastName,
            email: user.email || "",
            phone: user.phone || user.phone_number || "",
            address: user.address || ""
          });
        }
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    
    try {
      // Update profile in Supabase
      const updatedProfile = await userAPI.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
      });

      // Update context with new data
      updateUser(updatedProfile);

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.editProfile}>
        <div className={styles.header}>
          <Link to="/profile" className={styles.backButton}>
            <FaArrowLeft className={styles.backIcon} />
          </Link>
          <h1 className={styles.pageTitle}>Edit Profile</h1>
          <div className={styles.placeholder}></div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ color: '#64748b' }}>Loading profile data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.editProfile}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/profile" className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
        </Link>
        <h1 className={styles.pageTitle}>Edit Profile</h1>
        <div className={styles.placeholder}></div>
      </div>

      {/* Profile Picture Section */}
      <section className={styles.profilePictureSection}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <FaUser className={styles.avatarIcon} />
          </div>
          <button type="button" className={styles.cameraButton}>
            <FaCamera className={styles.cameraIcon} />
          </button>
        </div>
        <p className={styles.avatarHint}>Tap to change profile picture</p>
      </section>

      {/* Form Section */}
      <section className={styles.formSection}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* First Name */}
          <div className={styles.formGroup}>
            <label htmlFor="first_name" className={styles.label}>
              <FaUser className={styles.labelIcon} />
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div className={styles.formGroup}>
            <label htmlFor="last_name" className={styles.label}>
              <FaUser className={styles.labelIcon} />
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Email (Read-only) */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <FaEnvelope className={styles.labelIcon} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className={styles.input}
              placeholder="Enter your email"
              disabled
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              <FaPhone className={styles.labelIcon} />
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Address */}
          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>
              <FaMapMarkerAlt className={styles.labelIcon} />
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your address"
            />
          </div>

          {/* Submit Button */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditProfile;

