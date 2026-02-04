import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { supabase } from "../../lib/supabase";
import { adminAPI } from "../../services/api";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState("email"); // "email", "reset", "success"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error("Database is not configured. Please contact administrator.");
      }

      // Request password reset (checks if admin exists in database)
      await adminAPI.requestPasswordReset(email);

      setSuccess("Admin email verified! You can now reset your password.");
      setStep("reset");
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to verify email. Please check your email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error("Database is not configured. Please contact administrator.");
      }

      // Reset password in database
      // Note: Password should be hashed server-side, but for now we'll store it
      // In production, use Supabase Edge Function to hash the password
      await adminAPI.resetPassword(email, newPassword);

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we have a reset token in URL (from email link) or Supabase session
  useEffect(() => {
    // Check for Supabase password reset session
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setStep("reset");
      }
    });

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const type = urlParams.get("type");
    
    if (token === "recovery" || type === "recovery") {
      setStep("reset");
    }

    // Check if we have a valid session (user clicked email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStep("reset");
      }
    };
    checkSession();
  }, []);

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.forgotPasswordContainer}>
        <div className={styles.forgotPasswordCard}>
          <div className={styles.header}>
            <Link to="/admin/login" className={styles.backLink}>
              <FaArrowLeft /> Back to Login
            </Link>
            <div className={styles.logo}>
              <span className={styles.logoText}>PUSCART</span>
            </div>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>
              {step === "email" 
                ? "Enter your email address to receive a password reset link"
                : step === "reset"
                ? "Enter your new password"
                : "Password reset successful!"}
            </p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  <FaEnvelope className={styles.labelIcon} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Enter your admin email"
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handlePasswordReset} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  <FaLock className={styles.labelIcon} />
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter new password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  <FaLock className={styles.labelIcon} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Confirm new password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

