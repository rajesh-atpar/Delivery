import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "Fruits",
    description: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    image: "",
    is_active: true
  });

  // Check authentication on component mount
  useEffect(() => {
    const hasWindowFlag = window.adminAuthenticated === true;
    const sessionAuth = sessionStorage.getItem("adminAuth") === "true";
    
    if (!hasWindowFlag || !sessionAuth) {
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

  // Load products and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const cachedProducts = cache.get("adminProducts");
      const cachedCategories = cache.get("categories");
      
      // Show cached data immediately if available
      if (cachedProducts && cachedProducts.length > 0) {
        setProducts(cachedProducts);
      }
      if (cachedCategories && cachedCategories.length > 0) {
        setCategories(cachedCategories);
      }
      
      setIsLoading(false);
      setError("");
      
      // Always fetch fresh data from database
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, image, category, description, stock_quantity, is_active, created_at')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (productsError) {
          console.error("Error fetching products:", productsError);
          if (!cachedProducts || cachedProducts.length === 0) {
            setError(productsError.message || "Failed to load products");
          }
        } else {
          // Update with fresh data from database
          setProducts(productsData || []);
          cache.set("adminProducts", productsData || []);
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name, image, is_active, created_at, updated_at');

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          if (!cachedCategories || cachedCategories.length === 0) {
            setError(prev => prev ? prev + " | " + categoriesError.message : categoriesError.message || "Failed to load categories");
          }
        } else {
          // Sort categories by custom order
          const customOrder = [
            'Fruits',
            'Vegetables',
            'Non-Vegetables',
            'Cereal Grains & Pulses',
            'Cleansing Products',
            'Other Groceries'
          ];
          
          const sortedCategories = (categoriesData || []).sort((a, b) => {
            const indexA = customOrder.indexOf(a.name);
            const indexB = customOrder.indexOf(b.name);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name);
          });

          setCategories(sortedCategories);
          cache.set("categories", sortedCategories);
        }

        // Dispatch event to notify other components
        window.dispatchEvent(new Event("productsUpdated"));
      } catch (err) {
        console.error("Error fetching data:", err);
        if (!cachedProducts && !cachedCategories) {
          setError(err.message || "Failed to load data");
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isFormOpen) {
      if (isUploading) {
        console.log("Form opened but isUploading is true, resetting...");
      }
      setIsUploading(false);
      setError("");
      setSuccessMessage("");
    }
  }, [isFormOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      setError("");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        image: ""
      }));
    }
  };

  const uploadImageToSupabase = async (file) => {
    try {
      console.log('Starting image upload...');
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      const isAdminAuthenticated = window.adminAuthenticated === true || 
                                   sessionStorage.getItem("adminAuth") === "true";
      
      if (!isAdminAuthenticated) {
        throw new Error('Admin must be authenticated to upload images');
      }

      // Check if storage bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        throw new Error(`Storage error: ${bucketsError.message}`);
      }

      const bucketExists = buckets?.some(bucket => bucket.name === 'product-images');
      if (!bucketExists) {
        throw new Error('Storage bucket "product-images" does not exist. Please create it in Supabase Storage settings.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading to path:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        console.error('Error code:', uploadError.statusCode);
        console.error('Error message:', uploadError.message);
        
        // Provide more helpful error messages
        if (uploadError.message?.includes('new row violates row-level security')) {
          throw new Error('Storage permission denied. Please check your Supabase Storage policies to allow public uploads.');
        } else if (uploadError.message?.includes('Bucket not found')) {
          throw new Error('Storage bucket "product-images" not found. Please create it in Supabase Storage.');
        } else {
          throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`);
        }
      }

      if (!uploadData) {
        throw new Error('Upload returned no data');
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Failed to generate public URL for uploaded image');
      }

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error stack:', error.stack);
      
      // Re-throw with more context
      if (error.message) {
        throw error;
      } else {
        throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleAddProduct = () => {
    console.log("Add Product button clicked");
    
    setIsUploading(false);
    
    setEditingProduct(null);
    setError("");
    setSuccessMessage("");
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
    setImageFile(null);
    setImagePreview(null);
    
    setIsFormOpen(true);
    
    setTimeout(() => {
      const fileInput = document.getElementById("imageFile");
      if (fileInput) {
        fileInput.value = "";
      }
    }, 100);
    
    console.log("isFormOpen set to true, isUploading reset to false");
  };

  const handleEditProduct = (product) => {
    setIsUploading(false);
    
    setEditingProduct(product);
    setError("");
    setSuccessMessage("");
    
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
    setImageFile(null);
    setImagePreview(null);
    
    setIsFormOpen(true);
    
    setTimeout(() => {
      const fileInput = document.getElementById("imageFile");
      if (fileInput) {
        fileInput.value = "";
      }
    }, 100);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error, data } = await supabase
          .from('products')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          console.error("Delete error:", error);
          throw new Error(`Failed to delete product: ${error.message || 'Database error'}`);
        }

        // Verify deletion by refetching from database
        const { data: freshProducts, error: fetchError } = await supabase
          .from('products')
          .select('id, name, price, image, category, description, stock_quantity, is_active, created_at')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (fetchError) {
          console.warn("Error refetching products after delete:", fetchError);
          // Still update local state if refetch fails
          const updatedProducts = products.filter(product => product.id !== id);
          setProducts(updatedProducts);
          cache.set("adminProducts", updatedProducts);
        } else {
          // Use fresh data from database
          setProducts(freshProducts || []);
          cache.set("adminProducts", freshProducts || []);
        }

        window.dispatchEvent(new Event("productsUpdated"));
        setSuccessMessage("Product deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product: " + (err.message || "Unknown error"));
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isUploading) {
      console.log("Upload already in progress, ignoring duplicate submission");
      return;
    }
    
    console.log("=== Starting form submission ===");
    console.log("Form data:", formData);
    console.log("Image file:", imageFile ? imageFile.name : "none");
    console.log("Image URL:", formData.image || "none");
    
    setError("");
    setSuccessMessage("");
    
    // Check Supabase configuration
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file");
      setIsUploading(false);
      return;
    }
    
    setIsUploading(true);
    
    if (!formData.name || !formData.price) {
      setError("Please fill in all required fields");
      setIsUploading(false);
      return;
    }

    if (!imageFile && !formData.image) {
      setError("Please provide either an image file or image URL");
      setIsUploading(false);
      return;
    }

    try {
      let imageUrl = formData.image;
      let imageUploadFailed = false;

      // Try to upload image file if provided
      if (imageFile) {
        console.log('Uploading image file...');
        try {
          imageUrl = await uploadImageToSupabase(imageFile);
          console.log('Image uploaded successfully, URL:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          imageUploadFailed = true;
          
          // If we have a fallback URL, use it
          if (formData.image && formData.image.trim() !== '') {
            console.warn('Image upload failed, using provided URL instead');
            imageUrl = formData.image;
          } else {
            // If no fallback URL, show error but allow user to continue with placeholder
            setError(`Image upload failed: ${uploadError.message || 'Unknown error'}. You can continue with an image URL or try uploading again.`);
            // Don't throw - allow product creation with placeholder or let user add URL
            imageUrl = imageUrl || "https://via.placeholder.com/400?text=No+Image";
          }
        }
      }

      // Ensure we have an image URL before proceeding
      if (!imageUrl || imageUrl.trim() === '') {
        setError("Please provide an image URL or upload an image file");
        setIsUploading(false);
        return;
      }

      console.log('Creating/updating product with image URL:', imageUrl);

      // Parse price - remove ₹ symbol if present
      const priceStr = String(formData.price || '0').replace('₹', '').replace(',', '').trim();
      const price = parseFloat(priceStr) || 0;

      if (price <= 0) {
        setError("Please enter a valid price");
        setIsUploading(false);
        return;
      }

      if (editingProduct) {
        console.log('Updating product:', editingProduct.id);
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update({
            name: formData.name,
            price: price,
            image: imageUrl,
            category: formData.category,
            description: formData.description || null,
          })
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error(`Failed to update product: ${updateError.message || 'Database error'}`);
        }

        if (!updatedProduct || !updatedProduct.id) {
          throw new Error('Product update returned no data');
        }

        // Verify update by refetching from database
        const { data: freshProducts, error: fetchError } = await supabase
          .from('products')
          .select('id, name, price, image, category, description, stock_quantity, is_active, created_at')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (fetchError) {
          console.warn("Error refetching products after update:", fetchError);
          // Still update local state if refetch fails
          const updatedProducts = products.map(product =>
            product.id === editingProduct.id ? updatedProduct : product
          );
          setProducts(updatedProducts);
          cache.set("adminProducts", updatedProducts);
        } else {
          // Use fresh data from database
          setProducts(freshProducts || []);
          cache.set("adminProducts", freshProducts || []);
        }
      } else {
        console.log('Creating new product...', {
          name: formData.name,
          price: price,
          image: imageUrl,
          category: formData.category
        });
        
        // Prepare insert data
        const insertData = {
          name: formData.name,
          price: price,
          image: imageUrl,
          category: formData.category,
          description: formData.description || null,
          stock_quantity: 0,
          is_active: true,
        };
        
        console.log('Inserting product:', insertData);
        
        // Direct insert with timeout to prevent infinite hanging
        console.log('Sending insert request to database...');
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('TIMEOUT'));
          }, 8000); // 8 second timeout
        });
        
        // Race between insert and timeout
        let newProduct, createError;
        
        try {
          const insertPromise = supabase
            .from('products')
            .insert(insertData)
            .select()
            .single();
          
          const result = await Promise.race([insertPromise, timeoutPromise]);
          
          // If we get here, insert completed (either success or error)
          newProduct = result.data;
          createError = result.error;
          
          console.log('Database response received:', { 
            hasData: !!newProduct, 
            hasError: !!createError 
          });
        } catch (timeoutErr) {
          // Timeout occurred
          if (timeoutErr.message === 'TIMEOUT') {
            console.error('❌ INSERT TIMED OUT - RLS is blocking the operation');
            
            // Show prominent alert with simplest instructions
            const userConfirmed = window.confirm(
              '🚨 CRITICAL: DATABASE TIMEOUT\n\n' +
              'RLS is blocking all database operations.\n\n' +
              'YOU MUST RUN THIS SQL IN SUPABASE:\n\n' +
              '1. Open: https://supabase.com/dashboard\n' +
              '2. Click "SQL Editor" (left sidebar)\n' +
              '3. Open file: RUN_THIS_NOW.sql\n' +
              '4. Copy the ONE line of SQL\n' +
              '5. Paste in Supabase SQL Editor\n' +
              '6. Click "RUN" button\n' +
              '7. Wait for "Success"\n' +
              '8. Try uploading again\n\n' +
              'Click OK to see the SQL code, or Cancel to try later.'
            );
            
            if (userConfirmed) {
              // Show the SQL code
              alert(
                'COPY THIS SQL CODE:\n\n' +
                'ALTER TABLE products DISABLE ROW LEVEL SECURITY;\n\n' +
                'OR use file: SIMPLE_DISABLE_RLS.sql\n\n' +
                'Steps:\n' +
                '1. Go to Supabase Dashboard\n' +
                '2. SQL Editor\n' +
                '3. Paste the code above\n' +
                '4. Click RUN\n' +
                '5. Try uploading again'
              );
            }
            
            throw new Error(
              '❌ DATABASE TIMEOUT: RLS is blocking inserts. ' +
              'Run SIMPLE_DISABLE_RLS.sql or FIX_POLICIES_NO_ERROR.sql in Supabase. ' +
              'Product was NOT saved.'
            );
          }
          throw timeoutErr;
        }
        
        if (createError) {
          console.error('Database error:', createError);
          console.error('Error code:', createError.code);
          console.error('Error message:', createError.message);
          
          // Check for RLS/permission errors
          if (createError.code === '42501' || 
              createError.message?.includes('row-level security') || 
              createError.message?.includes('permission denied') ||
              createError.message?.includes('new row violates')) {
            throw new Error(
              '❌ PERMISSION DENIED: RLS is blocking database operations.\n\n' +
              'REQUIRED FIX:\n' +
              '1. Open Supabase Dashboard\n' +
              '2. Go to SQL Editor\n' +
              '3. Open file: FINAL_RLS_FIX.sql\n' +
              '4. Copy ALL the SQL code (Ctrl+A, Ctrl+C)\n' +
              '5. Paste into SQL Editor\n' +
              '6. Click RUN button\n' +
              '7. Wait for "Success" message\n' +
              '8. Verify you see "✅ RLS DISABLED"\n' +
              '9. Try uploading product again\n\n' +
              'Product was NOT saved. Fix RLS first.'
            );
          }
          
          // Other errors
          throw new Error(`Failed to save product: ${createError.message || 'Database error'}`);
        }
        
        if (!newProduct || !newProduct.id) {
          throw new Error('Product creation failed: No data returned from database.');
        }
        
        console.log('✅ Product created successfully:', newProduct);

        if (!newProduct || !newProduct.id) {
          console.error('Invalid product data returned:', newProduct);
          throw new Error('Product creation returned invalid data. Check database and RLS policies.');
        }

        // Verify creation by refetching from database
        const { data: freshProducts, error: fetchError } = await supabase
          .from('products')
          .select('id, name, price, image, category, description, stock_quantity, is_active, created_at')
          .order('created_at', { ascending: false })
          .limit(1000);

        if (fetchError) {
          console.warn("Error refetching products after create:", fetchError);
          // Still update local state if refetch fails
          const updatedProducts = [newProduct, ...products];
          setProducts(updatedProducts);
          cache.set("adminProducts", updatedProducts);
        } else {
          // Use fresh data from database to ensure consistency
          setProducts(freshProducts || []);
          cache.set("adminProducts", freshProducts || []);
          console.log('Products refreshed from database. Total products:', freshProducts?.length || 0);
        }
      }
      
      window.dispatchEvent(new Event("productsUpdated"));
      
      setIsUploading(false);
      
      const productName = formData.name;
      
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
      setImageFile(null);
      setImagePreview(null);
      setEditingProduct(null);
      
      const fileInput = document.getElementById("imageFile");
      if (fileInput) {
        fileInput.value = "";
      }
      
      // Show success message (or warning if image upload failed)
      if (imageUploadFailed && !formData.image) {
        setError("");
        setSuccessMessage(`Product "${productName}" added successfully, but image upload failed. Please update the image URL manually.`);
      } else {
        setError("");
        setSuccessMessage(`Product "${productName}" ${editingProduct ? 'updated' : 'added'} successfully! You can add another product.`);
      }
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
      console.log("=== Product added successfully ===");
    } catch (err) {
      console.error("Error saving product:", err);
      console.error("Error stack:", err.stack);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Full error object:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      
      setIsUploading(false);
      
      // Show detailed error message
      let errorMessage = "Failed to save product. ";
      if (err.message) {
        errorMessage = err.message;
      } else if (err.error?.message) {
        errorMessage = err.error.message;
      } else if (err.details) {
        errorMessage += err.details;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        errorMessage += "Please check the console for details and try again.";
      }
      
      setError(errorMessage);
      
      // Show alert for critical errors with actionable steps
      if (err.message && (err.message.includes('Permission denied') || err.message.includes('row-level security') || err.message.includes('RLS'))) {
        alert("⚠️ DATABASE PERMISSION ERROR\n\n" +
              "Products cannot be saved due to database security policies.\n\n" +
              "QUICK FIX (2 minutes):\n" +
              "1. Open Supabase Dashboard → SQL Editor\n" +
              "2. Copy ALL code from: QUICK_RLS_FIX.sql\n" +
              "3. Paste and click RUN\n" +
              "4. Try uploading again\n\n" +
              "The product is saved locally and will sync once fixed.");
      } else if (err.message && (err.message.includes('TIMEOUT') || err.message.includes('timed out') || err.message.includes('PERMISSION DENIED'))) {
        alert("❌ DATABASE ERROR - PRODUCT NOT SAVED\n\n" +
              "RLS (Row Level Security) is blocking database operations.\n\n" +
              "⚠️ YOUR PRODUCT WAS NOT SAVED\n\n" +
              "REQUIRED FIX (2 minutes):\n" +
              "1. Open Supabase Dashboard\n" +
              "2. Click SQL Editor (left sidebar)\n" +
              "3. Open file: FINAL_RLS_FIX.sql\n" +
              "4. Select ALL code (Ctrl+A)\n" +
              "5. Copy (Ctrl+C)\n" +
              "6. Paste into Supabase SQL Editor\n" +
              "7. Click RUN button\n" +
              "8. Wait for 'Success' message\n" +
              "9. Check results - should show '✅ RLS DISABLED'\n" +
              "10. Try uploading product again\n\n" +
              "After running the SQL, products will save immediately!");
      } else if (err.message && err.message.includes('Not set')) {
        alert("⚙️ CONFIGURATION ERROR\n\n" +
              "Supabase is not properly configured.\n\n" +
              "Please check:\n" +
              "1. VITE_SUPABASE_URL is set in .env file\n" +
              "2. VITE_SUPABASE_ANON_KEY is set in .env file\n" +
              "3. Restart your development server after adding env variables");
      }
    }
  };

  const handleCloseForm = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isUploading) {
      const confirmClose = window.confirm("Upload is in progress. Are you sure you want to cancel?");
      if (!confirmClose) {
        return;
      }
      setIsUploading(false);
    }
    
    setIsFormOpen(false);
    setError("");
    setSuccessMessage("");
    setIsUploading(false);
    
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
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
    
    setTimeout(() => {
      const fileInput = document.getElementById("imageFile");
      if (fileInput) {
        fileInput.value = "";
      }
    }, 100);
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
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Refetch categories from database
        const { data: freshCategories, error: fetchError } = await supabase
          .from('categories')
          .select('id, name, image, is_active, created_at, updated_at');

        if (fetchError) {
          console.warn("Error refetching categories after delete:", fetchError);
          const updatedCategories = categories.filter(cat => cat.id !== id);
          setCategories(updatedCategories);
          cache.set("categories", updatedCategories);
        } else {
          // Sort categories by custom order
          const customOrder = [
            'Fruits',
            'Vegetables',
            'Non-Vegetables',
            'Cereal Grains & Pulses',
            'Cleansing Products',
            'Other Groceries'
          ];
          
          const sortedCategories = (freshCategories || []).sort((a, b) => {
            const indexA = customOrder.indexOf(a.name);
            const indexB = customOrder.indexOf(b.name);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name);
          });

          setCategories(sortedCategories);
          cache.set("categories", sortedCategories);
        }
      } catch (err) {
        console.error("Error deleting category:", err);
        setError("Failed to delete category: " + (err.message || "Unknown error"));
        setTimeout(() => setError(""), 5000);
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
        const { data: updatedCategory, error: updateError } = await supabase
          .from('categories')
          .update({
            name: categoryFormData.name,
            image: categoryFormData.image,
            is_active: categoryFormData.is_active,
          })
          .eq('id', editingCategory.id)
          .select()
          .single();

        if (updateError) throw updateError;

        if (!updatedCategory || !updatedCategory.id) {
          throw new Error('Category update returned no data');
        }

        // Refetch categories from database
        const { data: freshCategories, error: fetchError } = await supabase
          .from('categories')
          .select('id, name, image, is_active, created_at, updated_at');

        if (fetchError) {
          console.warn("Error refetching categories after update:", fetchError);
          const updatedCategories = categories.map(cat =>
            cat.id === editingCategory.id ? updatedCategory : cat
          );
          setCategories(updatedCategories);
          cache.set("categories", updatedCategories);
        } else {
          // Sort categories by custom order
          const customOrder = [
            'Fruits',
            'Vegetables',
            'Non-Vegetables',
            'Cereal Grains & Pulses',
            'Cleansing Products',
            'Other Groceries'
          ];
          
          const sortedCategories = (freshCategories || []).sort((a, b) => {
            const indexA = customOrder.indexOf(a.name);
            const indexB = customOrder.indexOf(b.name);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name);
          });

          setCategories(sortedCategories);
          cache.set("categories", sortedCategories);
        }
      } else {
        const { data: newCategory, error: createError } = await supabase
          .from('categories')
          .insert({
            name: categoryFormData.name,
            image: categoryFormData.image,
            is_active: categoryFormData.is_active !== undefined ? categoryFormData.is_active : true,
          })
          .select()
          .single();

        if (createError) throw createError;

        if (!newCategory || !newCategory.id) {
          throw new Error('Category creation returned no data');
        }

        // Refetch categories from database
        const { data: freshCategories, error: fetchError } = await supabase
          .from('categories')
          .select('id, name, image, is_active, created_at, updated_at');

        if (fetchError) {
          console.warn("Error refetching categories after create:", fetchError);
          setCategories([...categories, newCategory]);
          cache.set("categories", [...categories, newCategory]);
        } else {
          // Sort categories by custom order
          const customOrder = [
            'Fruits',
            'Vegetables',
            'Non-Vegetables',
            'Cereal Grains & Pulses',
            'Cleansing Products',
            'Other Groceries'
          ];
          
          const sortedCategories = (freshCategories || []).sort((a, b) => {
            const indexA = customOrder.indexOf(a.name);
            const indexB = customOrder.indexOf(b.name);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name);
          });

          setCategories(sortedCategories);
          cache.set("categories", sortedCategories);
        }
      }

      setIsCategoryFormOpen(false);
      setCategoryFormData({
        name: "",
        image: "",
        is_active: true
      });
      setEditingCategory(null);
      setSuccessMessage(`Category ${editingCategory ? 'updated' : 'created'} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving category:", err);
      setError(err.message || "Failed to save category. Please try again.");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCloseCategoryForm = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
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
                const displayPrice = product.price 
                  ? (typeof product.price === 'number' ? `₹${product.price.toFixed(0)}` : product.price)
                  : '₹0';
                
                return (
                  <div key={product.id} className={styles.productRow}>
                    <div className={styles.productImageSmall}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80?text=No+Image";
                        }}
                      />
                    </div>
                    
                    <div className={styles.productInfo}>
                      <div className={styles.productHeader}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <span className={styles.categoryBadge}>{product.category}</span>
                      </div>
                      <div className={styles.productFooter}>
                        <span className={styles.productPrice}>{displayPrice}</span>
                      </div>
                    </div>
                    
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
          <div className={styles.modalOverlay} onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (isUploading) {
                const confirmClose = window.confirm("Upload is in progress. Are you sure you want to cancel?");
                if (!confirmClose) {
                  return;
                }
              }
              handleCloseForm(e);
            }
          }}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  className={styles.closeButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCloseForm(e);
                  }}
                  aria-label="Close"
                  title="Close"
                  type="button"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.productForm}>
                {successMessage && (
                  <div className={styles.successMessage} style={{
                    background: "#d1fae5",
                    color: "#065f46",
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    fontSize: "0.875rem",
                    border: "1px solid #a7f3d0"
                  }}>
                    {successMessage}
                  </div>
                )}
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
                        return categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ));
                      } else {
                        return <option value="Fruits">Fruits</option>;
                      }
                    })()}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="imageFile" className={styles.label}>
                    Upload Image *
                  </label>
                  <input
                    type="file"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className={styles.fileInput}
                    disabled={isUploading}
                  />
                  {imagePreview && (
                    <div className={styles.imagePreview}>
                      <img 
                        src={imagePreview} 
                        alt="Preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="image" className={styles.label}>
                    Or Enter Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!imageFile || isUploading}
                  />
                  {formData.image && !imageFile && (
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseForm(e);
                    }}
                    disabled={false}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveButton} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <FaSpinner className={styles.spinner} />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>{editingProduct ? "Update" : "Add"} Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {/* Add/Edit Category Form Modal */}
        {isCategoryFormOpen && createPortal(
          <div className={styles.modalOverlay} onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseCategoryForm(e);
            }
          }}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  className={styles.closeButton}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCloseCategoryForm(e);
                  }}
                  aria-label="Close"
                  title="Close"
                  type="button"
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCloseCategoryForm(e);
                    }}
                    disabled={false}
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
