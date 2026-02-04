// Cache utility for managing localStorage cache with expiration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds (increased for better performance)

export const cache = {
  set: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}Timestamp`, Date.now().toString());
    } catch (error) {
      console.error(`Error setting cache for ${key}:`, error);
    }
  },

  get: (key) => {
    try {
      const data = localStorage.getItem(key);
      const timestamp = localStorage.getItem(`${key}Timestamp`);
      
      if (!data || !timestamp) {
        return null;
      }
      
      const age = Date.now() - parseInt(timestamp, 10);
      
      // If cache is older than duration, return null to force refresh
      if (age > CACHE_DURATION) {
        return null;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error getting cache for ${key}:`, error);
      return null;
    }
  },

  clear: (key) => {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}Timestamp`);
    } catch (error) {
      console.error(`Error clearing cache for ${key}:`, error);
    }
  },

  clearAll: () => {
    try {
      localStorage.removeItem("adminProducts");
      localStorage.removeItem("adminProductsTimestamp");
      localStorage.removeItem("categories");
      localStorage.removeItem("categoriesTimestamp");
    } catch (error) {
      console.error("Error clearing all cache:", error);
    }
  }
};

