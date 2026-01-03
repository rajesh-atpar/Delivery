import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Categories from "./components/pages/Categories";
import Loading from "./components/Loading";
import ImageCarousel from "./components/ImageCarousel";
import SearchBar from "./components/SearchBar";

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
        </Routes>
      </Router>
    </Loading>
  );
}

export default App;
