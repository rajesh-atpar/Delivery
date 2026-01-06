import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import Orders from "./components/pages/Orders";
import Cart from "./components/pages/Cart";
import Profile from "./components/pages/Profile";
import EditProfile from "./components/pages/EditProfile";
import ChangePassword from "./components/pages/ChangePassword";
import NotificationSettings from "./components/pages/NotificationSettings";
import PrivacySettings from "./components/pages/PrivacySettings";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import CategoriesPage from "./components/pages/CategoriesPage";
import Categories from "./components/pages/Categories";
import ProductCategories from "./components/ProductCategories";
import Loading from "./components/Loading";
import ImageCarousel from "./components/ImageCarousel";
import SearchBar from "./components/SearchBar";
import BottomNavigation from "./components/BottomNavigation";

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Navbar />
      {isHomePage && (
        <>
          <ImageCarousel />
          <SearchBar />
          <Categories />
          <ProductCategories />
        </>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route path="/profile/notifications" element={<NotificationSettings />} />
        <Route path="/profile/privacy" element={<PrivacySettings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <BottomNavigation />
    </>
  );
};

function App() {
  return (
    <Loading>
      <Router>
        <AppContent />
    </Router>
    </Loading>
  );
}

export default App;
