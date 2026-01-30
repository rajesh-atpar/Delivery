import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.searchWrapper} onSubmit={handleSearch}>
        <FaSearch className={styles.searchIconLeft} />
        <input
          type="text"
          placeholder="Search products..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <button 
          type="submit"
          className={styles.filterButton} 
          aria-label="Search"
          onClick={handleSearch}
        >
          <FaSearch className={styles.filterIcon} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

