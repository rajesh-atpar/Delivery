import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Products from "./components/pages/Products";
import Orders from "./components/pages/Orders";
import Profile from "./components/pages/Profile";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import CategoriesPage from "./components/pages/CategoriesPage";
import Categories from "./components/pages/Categories";
import Loading from "./components/Loading";
import ImageCarousel from "./components/ImageCarousel";
import SearchBar from "./components/SearchBar";
import BottomNavigation from "./components/BottomNavigation";

function App() {
  return (
    <Loading>
      <Router>
        <Navbar />
        <ImageCarousel />
        <SearchBar />
        <Categories />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <BottomNavigation />
      </Router>
    </Loading>
  );
}

export default App;
