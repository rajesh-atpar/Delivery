import { supabase, getUserProfile, upsertUserProfile } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to get auth token (for Supabase session)
const getAuthToken = () => {
  // Supabase stores session in localStorage, but we'll use the session from supabase client
  return null; // Not needed for Supabase
};

// Helper function to make API requests (for custom API endpoints if needed)
const apiRequest = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear auth data
      await supabase.auth.signOut();
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Authentication failed. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API using Supabase
export const authAPI = {
  login: async (email, password) => {
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured. Please set up your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile from profiles table
    let profile = null;
    try {
      profile = await getUserProfile(data.user.id);
    } catch (profileError) {
      // If profile doesn't exist, create a basic one
      console.log('Profile not found, creating basic profile');
      profile = {
        id: data.user.id,
        email: data.user.email,
        first_name: data.user.user_metadata?.first_name || '',
        last_name: data.user.user_metadata?.last_name || '',
        phone: data.user.user_metadata?.phone || '',
        address: data.user.user_metadata?.address || '',
      };
    }

    return {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile,
      },
    };
  },

  register: async (userData) => {
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured. Please set up your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }

    const { email, password, first_name, last_name, phone, address } = userData;

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone,
          address,
        },
      },
    });

    if (authError) throw authError;

    // Create user profile in profiles table
    if (authData.user) {
      try {
        const profile = await upsertUserProfile(authData.user.id, {
          email,
          first_name: first_name || '',
          last_name: last_name || '',
          phone: phone || '',
          address: address || '',
        });

        return {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            ...profile,
          },
        };
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
        // Still return user data even if profile creation fails
        return {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            first_name: first_name || '',
            last_name: last_name || '',
            phone: phone || '',
            address: address || '',
          },
        };
      }
    }

    throw new Error('Registration failed');
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  },
};

// User API using Supabase
export const userAPI = {
  getProfile: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('User not authenticated');

    // Get profile from profiles table
    try {
      const profile = await getUserProfile(user.id);
      return {
        id: user.id,
        email: user.email,
        ...profile,
      };
    } catch (profileError) {
      // If profile doesn't exist, return user metadata
      return {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || '',
      };
    }
  },

  updateProfile: async (userData) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Update profile in profiles table
    const updatedProfile = await upsertUserProfile(user.id, userData);

    // Also update user metadata in auth
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        address: userData.address,
      },
    });

    if (updateError) console.error('Error updating user metadata:', updateError);

    return {
      id: user.id,
      email: user.email,
      ...updatedProfile,
    };
  },
};

// Orders API using Supabase
export const ordersAPI = {
  getMyOrders: async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { orders: data || [] };
  },

  getOrderDetails: async (orderId) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  createOrder: async (orderData) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: orderData.status || 'pending',
        items: orderData.items || [],
        total_price: orderData.total_price || orderData.total || 0,
        delivery_address: orderData.delivery_address || orderData.address || '',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Cart API (if needed)
export const cartAPI = {
  getCart: async () => {
    return apiRequest('/cart');
  },

  addToCart: async (productId, quantity) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (itemId) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Products API using Supabase
export const productsAPI = {
  getAllProducts: async () => {
    // Cache user check to avoid repeated calls
    let user = null;
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
    } catch {
      // User not authenticated, continue as public
    }
    
    // For admin/authenticated users, get all products
    // For public, only get active products
    // Only select necessary fields for faster queries
    const query = supabase
      .from('products')
      .select('id, name, price, image, category, description, stock_quantity, is_active, created_at')
      .order('created_at', { ascending: false })
      .limit(1000); // Limit results for performance

    if (!user) {
      // Public users only see active products
      query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  getProductById: async (productId) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  },

  createProduct: async (productData) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to create products');

    // Parse price - remove ₹ symbol if present
    const priceStr = String(productData.price || '0').replace('₹', '').replace(',', '');
    const price = parseFloat(priceStr) || 0;

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        price: price,
        image: productData.image,
        category: productData.category,
        description: productData.description || null,
        stock_quantity: productData.stock_quantity || 0,
        is_active: productData.is_active !== undefined ? productData.is_active : true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateProduct: async (productId, productData) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to update products');

    // Parse price if provided
    const updateData = { ...productData };
    if (updateData.price) {
      const priceStr = String(updateData.price).replace('₹', '').replace(',', '');
      updateData.price = parseFloat(priceStr) || 0;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteProduct: async (productId) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to delete products');

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return { success: true };
  },
};

// Categories API using Supabase
export const categoriesAPI = {
  getAllCategories: async () => {
    // Only select necessary fields for faster queries
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image, is_active')
      .eq('is_active', true);

    if (error) throw error;
    
    // Custom order: Fruits, Vegetables, Non-Vegetables, Cereal Grains & Pulses, Cleansing Products, Other Groceries
    const customOrder = [
      'Fruits',
      'Vegetables',
      'Non-Vegetables',
      'Cereal Grains & Pulses',
      'Cleansing Products',
      'Other Groceries'
    ];
    
    // Sort categories by custom order
    const sortedData = (data || []).sort((a, b) => {
      const indexA = customOrder.indexOf(a.name);
      const indexB = customOrder.indexOf(b.name);
      
      // If both are in custom order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only A is in custom order, it comes first
      if (indexA !== -1) return -1;
      // If only B is in custom order, it comes first
      if (indexB !== -1) return 1;
      // If neither is in custom order, sort alphabetically
      return a.name.localeCompare(b.name);
    });
    
    return sortedData;
  },

  getAllCategoriesAdmin: async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to view all categories');

    // Only select necessary fields for faster queries
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image, is_active, created_at, updated_at');

    if (error) throw error;
    
    // Custom order: Fruits, Vegetables, Non-Vegetables, Cereal Grains & Pulses, Cleansing Products, Other Groceries
    const customOrder = [
      'Fruits',
      'Vegetables',
      'Non-Vegetables',
      'Cereal Grains & Pulses',
      'Cleansing Products',
      'Other Groceries'
    ];
    
    // Sort categories by custom order
    const sortedData = (data || []).sort((a, b) => {
      const indexA = customOrder.indexOf(a.name);
      const indexB = customOrder.indexOf(b.name);
      
      // If both are in custom order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only A is in custom order, it comes first
      if (indexA !== -1) return -1;
      // If only B is in custom order, it comes first
      if (indexB !== -1) return 1;
      // If neither is in custom order, sort alphabetically
      return a.name.localeCompare(b.name);
    });
    
    return sortedData;
  },

  getCategoryById: async (categoryId) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  },

  createCategory: async (categoryData) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to create categories');

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        image: categoryData.image,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to update categories');

    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteCategory: async (categoryId) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to delete categories');

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;
    return { success: true };
  },
};

export default {
  authAPI,
  userAPI,
  ordersAPI,
  cartAPI,
  productsAPI,
  categoriesAPI,
};
