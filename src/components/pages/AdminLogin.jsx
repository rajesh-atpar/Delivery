import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { adminAPI } from "../../services/api";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Don't auto-redirect - always show login page
  // User must login every time they visit

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Authenticate with database
      const adminData = await adminAPI.login(credentials.username, credentials.password);
      
      // Store authentication token - will be cleared on page refresh
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminUser", adminData.username);
      sessionStorage.setItem("adminUserId", adminData.id);
      sessionStorage.setItem("adminUserEmail", adminData.email);
      sessionStorage.setItem("adminAuthTime", Date.now().toString());
      
      // Set a flag that persists only for this navigation
      window.adminAuthenticated = true;
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.message || "Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <div className={styles.logo}>
              <span className={styles.logoText}>PUSCART</span>
            </div>
            <h1 className={styles.title}>Admin Login</h1>
            <p className={styles.subtitle}>Enter your credentials to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                <FaUser className={styles.labelIcon} />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                <FaLock className={styles.labelIcon} />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className={styles.forgotPasswordLink}>
            <Link to="/admin/forgot-password" className={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          <div className={styles.loginFooter}>
            <p className={styles.helpText}>
              Default credentials: <strong>admin</strong> / <strong>admin123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

