import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaImage, FaSignOutAlt } from "react-icons/fa";
import styles from "./Admin.module.css";

const Admin = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "Fruits"
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

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with default products
      const defaultProducts = [
        {
          id: 1,
          name: "Fresh Organic Apples",
          price: "₹99",
          image: "https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?q=80&w=1149&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          category: "Fruits"
        },
        {
          id: 2,
          name: "Fresh Tomatoes",
          price: "₹69",
          image: "https://plus.unsplash.com/premium_photo-1724849418331-97502da20f86?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxmcmVzaCUyMHRvbWF0b3xlbnwwfHwwfHx8MA%3D%3D",
          category: "Vegetables"
        },
        {
          id: 3,
          name: "Premium Rice 5kg",
          price: "₹259",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
          category: "Grains"
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem("adminProducts", JSON.stringify(defaultProducts));
    }
  }, []);

  // Save products to localStorage whenever products change
  // Also dispatch event to update Products page in real-time
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("adminProducts", JSON.stringify(products));
      // Dispatch custom event to notify Products page of changes
      window.dispatchEvent(new Event("productsUpdated"));
    }
  }, [products]);

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
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "Fruits"
    });
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image) {
      alert("Please fill in all fields");
      return;
    }

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id
          ? { ...product, ...formData }
          : product
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...formData
      };
      setProducts([...products, newProduct]);
    }

    setIsFormOpen(false);
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "Fruits"
    });
    setEditingProduct(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData({
      name: "",
      price: "",
      image: "",
      category: "Fruits"
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
                const price = parseInt(p.price.replace('₹', '')) || 0;
                return acc + price;
              }, 0)}
            </div>
            <div className={styles.statLabel}>Total Value (₹)</div>
          </div>
        </div>

        {/* Products List */}
        <div className={styles.productsSection}>
          <h2 className={styles.sectionTitle}>Products List</h2>
          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <FaImage className={styles.emptyIcon} />
              <p>No products found. Add your first product to get started.</p>
            </div>
          ) : (
            <div className={styles.productsList}>
              {products.map((product) => (
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
                      <span className={styles.productPrice}>{product.price}</span>
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
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Product Form Modal */}
        {isFormOpen && (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

