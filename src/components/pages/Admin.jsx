import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { productsAPI, categoriesAPI } from "../../services/api";
import { cache } from "../../utils/cache";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaImage, FaSignOutAlt, FaSpinner, FaTags } from "react-icons/fa";
import styles from "./Admin.module.css";

const Admin = () => {
  const navigate = useNavigate();
  
  // Initialize with cached data for instant display
  const getInitialProducts = () => {
    const cached = cache.get("adminProducts");
    return cached && cached.length > 0 ? cached : [];
  };
  
  const getInitialCategories = () => {
    const cached = cache.get("categories");
    if (cached && cached.length > 0) {
      return cached;
    }
    return [
      { id: "1", name: "Fruits", image: "", is_active: true },
      { id: "2", name: "Vegetables", image: "", is_active: true },
      { id: "3", name: "Non-Vegetables", image: "", is_active: true },
      { id: "4", name: "Cereal Grains & Pulses", image: "", is_active: true },
      { id: "5", name: "Other Groceries", image: "", is_active: true },
      { id: "6", name: "Cleansing Products", image: "", is_active: true }
    ];
  };
  
  const [products, setProducts] = useState(getInitialProducts());
  const [categories, setCategories] = useState(getInitialCategories());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("products"); // "products" or "categories"
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "Fruits",
    description: ""
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: "",
    is_active: true
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

  // Load products and categories from Supabase on mount with instant display
  useEffect(() => {
    // Data already shown from initial state - fetch fresh data in background
    const fetchData = async () => {
      // If we have cached data, no loading state needed
      const cachedProducts = cache.get("adminProducts");
      const cachedCategories = cache.get("categories");
      
      if ((cachedProducts && cachedProducts.length > 0) || (cachedCategories && cachedCategories.length > 0)) {
        setIsLoading(false);
      } else {
        setIsLoading(false); // Still no loading - show empty/default state
      }
      
      setError("");
      
      // Fetch fresh data in background (non-blocking)
      setTimeout(async () => {
        try {
          const [productsData, categoriesData] = await Promise.all([
            productsAPI.getAllProducts(),
            categoriesAPI.getAllCategoriesAdmin()
          ]);
          setProducts(productsData);
          setCategories(categoriesData);
          
          // Update cache
          cache.set("adminProducts", productsData);
          cache.set("categories", categoriesData);
          window.dispatchEvent(new Event("productsUpdated"));
        } catch (err) {
          console.error("Error fetching data:", err);
          // Don't show error if we have cached data
          if (!cachedProducts && !cachedCategories) {
            setError(err.message || "Failed to load data");
          }
        }
      }, 0); // Execute in next tick, non-blocking
    };

    fetchData();
  }, []);

  // Debug: Log when isFormOpen changes
  useEffect(() => {
    console.log("isFormOpen state changed:", isFormOpen);
  }, [isFormOpen]);

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
    const activeCategories = categories.filter(cat => cat.is_active);
    const defaultCategory = activeCategories.length > 0 
      ? activeCategories[0].name 
      : (categories.length > 0 ? categories[0].name : "Fruits");
    setFormData({
      name: "",
      price: "",
      image: "",
      category: defaultCategory,
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
        // Update cache
        cache.set("adminProducts", updatedProducts);
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
      
      // Clear cache to force refresh
      cache.clear("adminProducts");
      window.dispatchEvent(new Event("productsUpdated"));
      setIsFormOpen(false);
      const activeCategories = categories.filter(cat => cat.is_active);
      const defaultCategory = activeCategories.length > 0 
        ? activeCategories[0].name 
        : (categories.length > 0 ? categories[0].name : "Fruits");
      setFormData({
        name: "",
        price: "",
        image: "",
        category: defaultCategory,
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
    const activeCategories = categories.filter(cat => cat.is_active);
    const defaultCategory = activeCategories.length > 0 
      ? activeCategories[0].name 
      : (categories.length > 0 ? categories[0].name : "Fruits");
    setFormData({
      name: "",
      price: "",
      image: "",
      category: defaultCategory,
      description: ""
    });
    setEditingProduct(null);
  };

  // Category management handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: "",
      image: "",
      is_active: true
    });
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      image: category.image,
      is_active: category.is_active
    });
    setIsCategoryFormOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesAPI.deleteCategory(id);
        const updatedCategories = categories.filter(cat => cat.id !== id);
        setCategories(updatedCategories);
        // Update cache
        cache.set("categories", updatedCategories);
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete category: " + (err.message || "Unknown error"));
      }
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!categoryFormData.name.trim() || !categoryFormData.image.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      if (editingCategory) {
        const updatedCategory = await categoriesAPI.updateCategory(editingCategory.id, {
          name: categoryFormData.name,
          image: categoryFormData.image,
          is_active: categoryFormData.is_active,
        });
        const updatedCategories = categories.map(cat =>
          cat.id === editingCategory.id ? updatedCategory : cat
        );
        setCategories(updatedCategories);
        // Update cache
        cache.set("categories", updatedCategories);
      } else {
        const newCategory = await categoriesAPI.createCategory({
          name: categoryFormData.name,
          image: categoryFormData.image,
          is_active: categoryFormData.is_active,
        });
        setCategories([...categories, newCategory]);
        // Update cache
        cache.set("categories", [...categories, newCategory]);
      }

      setIsCategoryFormOpen(false);
      setCategoryFormData({
        name: "",
        image: "",
        is_active: true
      });
      setEditingCategory(null);
    } catch (err) {
      console.error("Error saving category:", err);
      setError(err.message || "Failed to save category. Please try again.");
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCloseCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setError("");
    setCategoryFormData({
      name: "",
      image: "",
      is_active: true
    });
    setEditingCategory(null);
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
            <p className={styles.subtitle}>Manage your products and categories</p>
          </div>
          <div className={styles.headerActions}>
            {activeTab === "products" ? (
              <button className={styles.addButton} onClick={handleAddProduct}>
                <FaPlus />
                <span>Add Product</span>
              </button>
            ) : (
              <button className={styles.addButton} onClick={handleAddCategory}>
                <FaPlus />
                <span>Add Category</span>
              </button>
            )}
            <button className={styles.logoutButton} onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "products" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={`${styles.tab} ${activeTab === "categories" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            <FaTags />
            Categories
          </button>
        </div>

        {/* Statistics Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{products.length}</div>
            <div className={styles.statLabel}>Total Products</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {categories.filter(cat => cat.is_active).length}
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

        {/* Categories List */}
        {activeTab === "categories" && (
          <div className={styles.productsSection}>
            <h2 className={styles.sectionTitle}>Categories List</h2>
            
            {isLoading ? (
              <div className={styles.loadingState}>
                <FaSpinner className={styles.spinner} />
                <p>Loading categories...</p>
              </div>
            ) : error && categories.length === 0 ? (
              <div className={styles.emptyState}>
                <FaTags className={styles.emptyIcon} />
                <p>{error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className={styles.emptyState}>
                <FaTags className={styles.emptyIcon} />
                <p>No categories found. Add your first category to get started.</p>
              </div>
            ) : (
              <div className={styles.productsList}>
                {categories.map((category) => (
                  <div key={category.id} className={styles.productRow}>
                    <div className={styles.productImageSmall}>
                      <img 
                        src={category.image && category.image.trim() !== "" 
                          ? category.image 
                          : "https://via.placeholder.com/80?text=No+Image"} 
                        alt={category.name}
                        onError={(e) => {
                          if (e.target.src !== "https://via.placeholder.com/80?text=No+Image") {
                            e.target.src = "https://via.placeholder.com/80?text=No+Image";
                          }
                        }}
                      />
                    </div>
                    
                    <div className={styles.productInfo}>
                      <div className={styles.productHeader}>
                        <h3 className={styles.productName}>{category.name}</h3>
                        <span className={`${styles.categoryBadge} ${!category.is_active ? styles.inactive : ''}`}>
                          {category.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.productActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditCategory(category)}
                        aria-label="Edit category"
                        type="button"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteCategory(category.id)}
                        aria-label="Delete category"
                        type="button"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products List */}
        {activeTab === "products" && (
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
        )}

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
                    {(() => {
                      const activeCategories = categories.filter(cat => cat.is_active);
                      if (activeCategories.length > 0) {
                        return activeCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ));
                      } else if (categories.length > 0) {
                        // If no active categories, show all categories
                        return categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ));
                      } else {
                        // Fallback if no categories at all
                        return <option value="Fruits">Fruits</option>;
                      }
                    })()}
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

        {/* Add/Edit Category Form Modal */}
        {isCategoryFormOpen && createPortal(
          <div className={styles.modalOverlay} onClick={handleCloseCategoryForm}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  className={styles.closeButton}
                  onClick={handleCloseCategoryForm}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className={styles.productForm}>
                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="categoryName" className={styles.label}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleCategoryInputChange}
                    className={styles.input}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="categoryImage" className={styles.label}>
                    Image URL *
                  </label>
                  <input
                    type="url"
                    id="categoryImage"
                    name="image"
                    value={categoryFormData.image}
                    onChange={handleCategoryInputChange}
                    className={styles.input}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  {categoryFormData.image && (
                    <div className={styles.imagePreview}>
                      <img 
                        src={categoryFormData.image} 
                        alt="Preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={categoryFormData.is_active}
                      onChange={handleCategoryInputChange}
                      className={styles.checkbox}
                    />
                    <span>Active (visible to users)</span>
                  </label>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleCloseCategoryForm}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveButton}>
                    <FaSave />
                    <span>{editingCategory ? "Update" : "Add"} Category</span>
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

