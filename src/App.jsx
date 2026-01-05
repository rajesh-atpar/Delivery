import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Orders from "./components/pages/Orders";
import Profile from "./components/pages/Profile";
import Categories from "./components/pages/Categories";
import ProductCategories from "./components/ProductCategories";
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
        <ProductCategories />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNavigation />
      </Router>
    </Loading>
  );
}

export default App;
