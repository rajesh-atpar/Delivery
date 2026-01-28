import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import Orders from "./components/pages/Orders";
import Cart from "./components/pages/Cart";
import Profile from "./components/pages/Profile";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import EditProfile from "./components/pages/EditProfile";
import ChangePassword from "./components/pages/ChangePassword";
import NotificationSettings from "./components/pages/NotificationSettings";
import PrivacySettings from "./components/pages/PrivacySettings";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Admin from "./components/pages/Admin";
import AdminLogin from "./components/pages/AdminLogin";
import Categories from "./components/pages/Categories";
import Loading from "./components/Loading";
import ImageCarousel from "./components/ImageCarousel";
import SearchBar from "./components/SearchBar";
import BottomNavigation from "./components/BottomNavigation";
import Footer from "./components/Footer";

// Protected Admin Route Component
const ProtectedAdmin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication status immediately and strictly
    // Clear auth on page load/refresh to require login every time
    const checkAuth = () => {
      // Check if there's a valid authentication flag from current session
      // This flag is set only after successful login and cleared on refresh
      const hasWindowFlag = window.adminAuthenticated === true;
      const sessionAuth = sessionStorage.getItem("adminAuth");
      
      // If page was refreshed, clear authentication and require login
      if (!hasWindowFlag) {
        // Clear all auth data
        sessionStorage.removeItem("adminAuth");
        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminAuthTime");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminAuthTime");
        setIsAuthenticated(false);
        setIsChecking(false);
        navigate("/admin/login", { replace: true });
        return;
      }
      
      // Only authenticate if window flag exists (set after login)
      if (hasWindowFlag && sessionAuth === "true") {
        setIsAuthenticated(true);
        setIsChecking(false);
      } else {
        // Clear any invalid auth data
        sessionStorage.removeItem("adminAuth");
        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminAuthTime");
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminAuthTime");
        setIsAuthenticated(false);
        setIsChecking(false);
        navigate("/admin/login", { replace: true });
      }
    };

    // Run check immediately
    checkAuth();
    
    // Clear auth flag on page unload (refresh/close)
    const handleBeforeUnload = () => {
      window.adminAuthenticated = false;
      sessionStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminAuthTime");
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)'
      }}>
        <div style={{ 
          textAlign: 'center',
          color: '#64748b',
          fontSize: '1.125rem'
        }}>
          Checking authentication...
        </div>
      </div>
    );
  }

  // Don't render Admin if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <Admin />;
};

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin/login";

  // Scroll to top on route change
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [location.pathname]);

  return (
    <>
      {/* Hide Navbar and Footer for admin routes */}
      {!isAdminRoute && <Navbar />}
      {isHomePage && !isAdminRoute && (
        <>
          <ImageCarousel />
          <SearchBar />
          <Categories />
          
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/change-password" element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/profile/notifications" element={
          <ProtectedRoute>
            <NotificationSettings />
          </ProtectedRoute>
        } />
        <Route path="/profile/privacy" element={
          <ProtectedRoute>
            <PrivacySettings />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
      </Routes>
      {/* Hide Footer for admin routes */}
      {!isAdminRoute && <Footer />}
      {/* Hide BottomNavigation for admin routes */}
      {!isAdminRoute && <BottomNavigation />}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Loading>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </Loading>
    </ErrorBoundary>
  );
}

export default App;
