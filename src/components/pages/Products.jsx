import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaShoppingCart, FaPlus, FaMinus, FaSpinner, FaCheck } from "react-icons/fa";
import { productsAPI } from "../../services/api";
import { cache } from "../../utils/cache";
import styles from "./Products.module.css";

const Products = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  
  // Initialize with cached data for instant display
  const getInitialProducts = () => {
    const cached = cache.get("adminProducts");
    if (cached && cached.length > 0) {
      return cached.map(product => ({
        ...product,
        price: typeof product.price === 'number' 
          ? `₹${product.price.toFixed(0)}` 
          : product.price || '₹0'
      }));
    }
    return []; // Return empty array if no cached data
  };
  
  const [products, setProducts] = useState(getInitialProducts());
  const [cartQuantities, setCartQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Start with false since we have cached/default data
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState({}); // Track products just added for animation

  // Load products from Supabase database with instant display
  useEffect(() => {
    // Data already shown from initial state - fetch fresh data in background
    const fetchProducts = async () => {
      setError("");
      
      // Check if we have cached data
      const cachedProducts = cache.get("adminProducts");
      
      // Fetch fresh data in background (non-blocking)
      setTimeout(async () => {
        try {
          const productsData = await productsAPI.getAllProducts();
          
          // Format products for display (convert price to string format if needed)
          const formattedProducts = productsData.map(product => ({
            ...product,
            price: typeof product.price === 'number' 
              ? `₹${product.price.toFixed(0)}` 
              : product.price || '₹0'
          }));
          
          // Only update if data changed
          setProducts(formattedProducts);
          
          // Update cache with fresh data
          cache.set("adminProducts", formattedProducts);
        } catch (err) {
          console.error("Error fetching products from database:", err);
          // Don't show error if we have cached data
          if (!cachedProducts || cachedProducts.length === 0) {
            setError("Failed to load products. Showing default products.");
          }
        }
      }, 0); // Execute in next tick, non-blocking
    };

    fetchProducts();

    // Listen for custom event (when admin updates products)
    const handleProductsUpdated = () => {
      fetchProducts();
    };

    window.addEventListener("productsUpdated", handleProductsUpdated);

    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, []);

  // Load cart items to check which products are already in cart
  useEffect(() => {
    const updateCartStatus = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const quantities = {};
      cartItems.forEach(item => {
        quantities[item.id] = item.quantity || 1;
      });
      setCartQuantities(quantities);
    };

    updateCartStatus();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartStatus();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "cartItems") {
        updateCartStatus();
      }
    });

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Categories that are sold by weight (per kg)
  const isWeightBased = (category) => {
    return ["Fruits", "Vegetables, Root Vegetables & Greens"].includes(category);
  };

  // Get increment value based on category (0.5 for weight-based, 1 for others)
  const getIncrement = (category) => {
    return isWeightBased(category) ? 0.5 : 1;
  };

  const handleAddToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const productId = product.id;
    const increment = getIncrement(product.category);
    const existingItemIndex = cartItems.findIndex(
      (item) => String(item.id) === String(productId)
    );

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += increment;
    } else {
      cartItems.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: increment // Start with 0.5 for weight-based, 1 for others
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setCartQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + increment
    }));
    
    // Set just added state for animation (only in mobile)
    setJustAdded((prev) => ({
      ...prev,
      [productId]: true
    }));
    
    // Remove animation state after animation completes
    setTimeout(() => {
      setJustAdded((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }, 2000);
    
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (product, direction) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existingItemIndex = cartItems.findIndex(
      (item) => String(item.id) === String(product.id)
    );
    
    if (existingItemIndex >= 0) {
      const increment = getIncrement(product.category);
      const change = direction > 0 ? increment : -increment;
      const newQuantity = cartItems[existingItemIndex].quantity + change;
      const minQty = isWeightBased(product.category) ? 0.5 : 1;
      
      if (newQuantity < minQty) {
        // Remove item if below minimum
        cartItems.splice(existingItemIndex, 1);
        setCartQuantities(prev => {
          const updated = { ...prev };
          delete updated[product.id];
          return updated;
        });
      } else {
        cartItems[existingItemIndex].quantity = newQuantity;
        setCartQuantities(prev => ({
          ...prev,
          [product.id]: newQuantity
        }));
      }
    }
    
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Filter products by category and/or search query
  const filteredProducts = products.filter(product => {
    // Filter by category if selected
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      const productName = (product.name || "").toLowerCase();
      const productCategory = (product.category || "").toLowerCase();
      const productDescription = (product.description || "").toLowerCase();
      
      return productName.includes(query) || 
             productCategory.includes(query) || 
             productDescription.includes(query);
    }
    return true;
  });

  return (
    <div className={styles.productsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : selectedCategory 
                ? selectedCategory 
                : "Our Products"}
          </h1>
          <p className={styles.subtitle}>
            {searchQuery 
              ? `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}` 
              : selectedCategory 
                ? `Browse ${selectedCategory} products` 
                : "Browse our wide selection of fresh and quality products"}
          </p>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}>
            <FaSpinner className={styles.spinner} />
            <p>Loading products...</p>
          </div>
        ) : error && products.length === 0 ? (
          <div className={styles.errorState}>
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.errorState}>
            <p>
              {selectedCategory 
                ? `No products found in ${selectedCategory} category.` 
                : "No products found."}
            </p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImageWrapper}>
                <div className={styles.productImage}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className={styles.productInfo}>
                <span className={styles.productCategory}>{product.category}</span>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>
                    {product.price}{isWeightBased(product.category) ? '/kg' : ''}
                  </span>
                  {cartQuantities[product.id] ? (
                    <>
                      {/* Desktop: Show quantity controls */}
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(product, -1)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className={styles.quantity}>
                          {isWeightBased(product.category) 
                            ? `${cartQuantities[product.id]} kg` 
                            : cartQuantities[product.id]}
                        </span>
                        <button
                          className={styles.quantityButton}
                          onClick={() => handleQuantityChange(product, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      {/* Mobile: Show "Added" button with tick icon */}
                      <button 
                        className={`${styles.addedButton} ${justAdded[product.id] ? styles.addedButtonAnimated : ''}`}
                        aria-label={`${product.name} added to cart`}
                      >
                        <FaCheck />
                        <span>Added</span>
                      </button>
                    </>
                  ) : (
                    <button 
                      className={styles.cartButton}
                      onClick={() => handleAddToCart(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <FaShoppingCart />
                      Add
                    </button>
                  )}
                </div>
            </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
