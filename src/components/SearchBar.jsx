import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIconLeft} />
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
        <button className={styles.filterButton} aria-label="Filter">
          <FaFilter className={styles.filterIcon} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

