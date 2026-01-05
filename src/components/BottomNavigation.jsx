import { Link, useLocation } from "react-router-dom";
import { FaHome, FaReceipt, FaShoppingBag, FaUser } from "react-icons/fa";
import styles from "./BottomNavigation.module.css";

const BottomNavigation = () => {
  const location = useLocation();

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

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <Link
            key={item.path}
            to={item.path}
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

