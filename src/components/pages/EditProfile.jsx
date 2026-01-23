import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaCamera } from "react-icons/fa";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Profile updated successfully!");
      navigate("/profile");
    }, 1000);
  };

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
          <button className={styles.cameraButton}>
            <FaCamera className={styles.cameraIcon} />
          </button>
        </div>
        <p className={styles.avatarHint}>Tap to change profile picture</p>
      </section>

      {/* Form Section */}
      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Full Name */}
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              <FaUser className={styles.labelIcon} />
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
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
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
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
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your street address"
              required
            />
          </div>

          {/* City, State, Zip */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="city" className={styles.label}>City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
                placeholder="City"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state" className={styles.label}>State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={styles.input}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="zipCode" className={styles.label}>Zip Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={styles.input}
                placeholder="Zip Code"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="country" className={styles.label}>Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={styles.input}
                placeholder="Country"
                required
              />
            </div>
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

