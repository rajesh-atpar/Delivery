import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import styles from "./ChangePassword.module.css";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword,
      });

      if (signInError) {
        setErrors({ currentPassword: "Current password is incorrect" });
        setIsSubmitting(false);
        return;
      }

      // Update password using Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (updateError) {
        throw updateError;
      }

      // Success - show message and redirect
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ 
        submit: error.message || "Failed to change password. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.changePassword}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/profile" className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
        </Link>
        <h1 className={styles.pageTitle}>Change Password</h1>
        <div className={styles.placeholder}></div>
      </div>

      {/* Info Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoCard}>
          <FaLock className={styles.infoIcon} />
          <h2 className={styles.infoTitle}>Password Security</h2>
          <p className={styles.infoText}>
            Your password should be at least 8 characters long and include a mix of letters, numbers, and special characters.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Current Password */}
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword" className={styles.label}>
              <FaLock className={styles.labelIcon} />
              Current Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`${styles.input} ${errors.currentPassword ? styles.inputError : ""}`}
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className={styles.eyeButton}
              >
                {showPasswords.current ? (
                  <FaEyeSlash className={styles.eyeIcon} />
                ) : (
                  <FaEye className={styles.eyeIcon} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <span className={styles.errorText}>{errors.currentPassword}</span>
            )}
          </div>

          {/* New Password */}
          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              <FaLock className={styles.labelIcon} />
              New Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPasswords.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`${styles.input} ${errors.newPassword ? styles.inputError : ""}`}
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className={styles.eyeButton}
              >
                {showPasswords.new ? (
                  <FaEyeSlash className={styles.eyeIcon} />
                ) : (
                  <FaEye className={styles.eyeIcon} />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <span className={styles.errorText}>{errors.newPassword}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              <FaLock className={styles.labelIcon} />
              Confirm New Password
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className={styles.eyeButton}
              >
                {showPasswords.confirm ? (
                  <FaEyeSlash className={styles.eyeIcon} />
                ) : (
                  <FaEye className={styles.eyeIcon} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className={styles.successMessage}>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className={styles.errorMessage}>
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ChangePassword;

