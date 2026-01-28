import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaReceipt, FaShoppingBag, FaUser } from "react-icons/fa";
import styles from "./BottomNavigation.module.css";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      path: "/",
      icon: FaHome,
      label: "Home"
    },
    {
      path: "/orders",
      icon: FaReceipt,
      label: "Orders"
    },
    {
      path: "/cart",
      icon: FaShoppingBag,
      label: "Cart"
    },
    {
      path: "/profile",
      icon: FaUser,
      label: "Profile"
    }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        const isProfile = item.path === "/profile";
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={isProfile ? handleProfileClick : undefined}
            className={`${styles.navItem} ${active ? styles.active : ""}`}
            aria-label={item.label}
          >
            <Icon className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;

