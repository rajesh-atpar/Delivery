import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { productsAPI } from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaImage, FaSignOutAlt, FaSpinner } from "react-icons/fa";
import styles from "./Admin.module.css";

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "Fruits",
    description: ""
  });

  // Check authentication on component mount
  useEffect(() => {
    // Check both window flag and sessionStorage
    const hasWindowFlag = window.adminAuthenticated === true;
    const sessionAuth = sessionStorage.getItem("adminAuth") === "true";
    
    if (!hasWindowFlag || !sessionAuth) {
      // Clear all auth data
      window.adminAuthenticated = false;
      sessionStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminAuthTime");
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminAuthTime");
      navigate("/admin/login", { replace: true });
      return;
    }
  }, [navigate]);

  // Load products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const productsData = await productsAPI.getAllProducts();
        setProducts(productsData);
        // Also update localStorage for backward compatibility with Products page
        localStorage.setItem("adminProducts", JSON.stringify(productsData));
        window.dispatchEvent(new Event("productsUpdated"));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
        // Fallback to localStorage if Supabase fails
        const savedProducts = localStorage.getItem("adminProducts");
        if (savedProducts) {
          try {
            setProducts(JSON.parse(savedProducts));
          } catch {
            setProducts([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Debug: Log when isFormOpen changes
  useEffect(() => {
    console.log("isFormOpen state changed:", isFormOpen);
  }, [isFormOpen]);

  const categories = [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Meat",
    "Grains",
    "Beverages",
    "Snacks",
    "Oils"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = () => {
    console.log("Add Product button clicked");
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "Fruits",
      description: ""
    });
    setIsFormOpen(true);
    console.log("isFormOpen set to true");
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    // Format price for form input - handle both number and string
    let formattedPrice = '';
    if (typeof product.price === 'number') {
      formattedPrice = `₹${product.price.toFixed(0)}`;
    } else if (typeof product.price === 'string') {
      formattedPrice = product.price;
    } else {
      formattedPrice = '';
    }
    
    setFormData({
      name: product.name || '',
      price: formattedPrice,
      image: product.image || '',
      category: product.category || 'Fruits',
      description: product.description || ""
    });
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsAPI.deleteProduct(id);
        // Remove from local state
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
        // Update localStorage
        localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
        window.dispatchEvent(new Event("productsUpdated"));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product: " + (err.message || "Unknown error"));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.name || !formData.price || !formData.image) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product in Supabase
        const updatedProduct = await productsAPI.updateProduct(editingProduct.id, {
          name: formData.name,
          price: formData.price,
          image: formData.image,
          category: formData.category,
          description: formData.description || null,
        });
        
        // Update local state
        const updatedProducts = products.map(product =>
          product.id === editingProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts);
        localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
      } else {
        // Create new product in Supabase
        const newProduct = await productsAPI.createProduct({
          name: formData.name,
          price: formData.price,
          image: formData.image,
          category: formData.category,
          description: formData.description || null,
        });
        
        // Add to local state
        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);
        localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
      }
      
      window.dispatchEvent(new Event("productsUpdated"));
      setIsFormOpen(false);
      setFormData({
        name: "",
        price: "",
        image: "",
        category: "Fruits",
        description: ""
      });
      setEditingProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.message || "Failed to save product. Please try again.");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setError("");
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "Fruits",
      description: ""
    });
    setEditingProduct(null);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear all admin authentication data from both storage types and window flag
      window.adminAuthenticated = false;
      sessionStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminAuthTime");
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminAuthTime");
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Manage your products inventory</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.addButton} onClick={handleAddProduct}>
              <FaPlus />
              <span>Add Product</span>
            </button>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{products.length}</div>
            <div className={styles.statLabel}>Total Products</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {categories.reduce((acc, cat) => {
                const count = products.filter(p => p.category === cat).length;
                return count > 0 ? acc + 1 : acc;
              }, 0)}
            </div>
            <div className={styles.statLabel}>Active Categories</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {products.reduce((acc, p) => {
                // Handle both number (from Supabase) and string (from localStorage) prices
                let price = 0;
                if (typeof p.price === 'number') {
                  price = p.price;
                } else if (typeof p.price === 'string') {
                  price = parseFloat(p.price.replace(/₹|,/g, '')) || 0;
                }
                return acc + price;
              }, 0).toFixed(0)}
            </div>
            <div className={styles.statLabel}>Total Value (₹)</div>
          </div>
        </div>

        {/* Products List */}
        <div className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>Products List</h2>
          
          {isLoading ? (
            <div className={styles.loadingState}>
              <FaSpinner className={styles.spinner} />
              <p>Loading products...</p>
            </div>
          ) : error && products.length === 0 ? (
            <div className={styles.emptyState}>
              <FaImage className={styles.emptyIcon} />
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <FaImage className={styles.emptyIcon} />
              <p>No products found. Add your first product to get started.</p>
            </div>
          ) : (
            <div className={styles.productsList}>
              {products.map((product) => {
                // Format price for display
                const displayPrice = product.price 
                  ? (typeof product.price === 'number' ? `₹${product.price.toFixed(0)}` : product.price)
                  : '₹0';
                
                return (
                  <div key={product.id} className={styles.productRow}>
                    {/* Product Image */}
                    <div className={styles.productImageSmall}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80?text=No+Image";
                        }}
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className={styles.productInfo}>
                      <div className={styles.productHeader}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <span className={styles.categoryBadge}>{product.category}</span>
                      </div>
                      <div className={styles.productFooter}>
                        <span className={styles.productPrice}>{displayPrice}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className={styles.productActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditProduct(product)}
                        aria-label="Edit product"
                        type="button"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteProduct(product.id)}
                        aria-label="Delete product"
                        type="button"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Product Form Modal */}
        {isFormOpen && createPortal(
          <div className={styles.modalOverlay} onClick={handleCloseForm}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  className={styles.closeButton}
                  onClick={handleCloseForm}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.productForm}>
                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>
                    Price (₹) *
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="₹99"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.label}>
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="image" className={styles.label}>
                    Image URL *
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  {formData.image && (
                    <div className={styles.imagePreview}>
                      <img 
                        src={formData.image} 
                        alt="Preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Enter product description"
                    rows="3"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    <FaSave />
                    <span>{editingProduct ? "Update" : "Add"} Product</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default Admin;

