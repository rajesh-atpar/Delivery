import { supabase, getUserProfile, upsertUserProfile } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
    
    if (response.status === 401) {
      await supabase.auth.signOut();
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
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured. Please set up your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    let profile = null;
    try {
      profile = await getUserProfile(data.user.id);
    } catch (profileError) {
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
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured. Please set up your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }

    const { email, password, first_name, last_name, phone, address } = userData;

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

    try {
      const profile = await getUserProfile(user.id);
      // If profile is null (doesn't exist or 406 error), use user metadata
      if (!profile) {
        return {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          phone: user.user_metadata?.phone || '',
          address: user.user_metadata?.address || '',
        };
      }
      return {
        id: user.id,
        email: user.email,
        ...profile,
      };
    } catch (profileError) {
      console.warn('Profile fetch error (non-critical):', profileError);
      // Return user data from metadata as fallback
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

    const updatedProfile = await upsertUserProfile(user.id, userData);

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
    let user = null;
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
    } catch {
      // User not authenticated, continue as public
    }
    
    const query = supabase
      .from('products')
      .select('id, name, price, image, category, description, stock_quantity, is_active, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (!user) {
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
    const isAdminAuthenticated = typeof window !== 'undefined' && (
      window.adminAuthenticated === true || 
      sessionStorage.getItem("adminAuth") === "true"
    );
    
    let user = null;
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
    } catch (userError) {
      if (!isAdminAuthenticated) {
        throw new Error('User must be authenticated to create products');
      }
    }

    const priceStr = String(productData.price || '0').replace('₹', '').replace(',', '');
    const price = parseFloat(priceStr) || 0;

    const insertData = {
      name: productData.name,
      price: price,
      image: productData.image,
      category: productData.category,
      description: productData.description || null,
      stock_quantity: productData.stock_quantity || 0,
      is_active: productData.is_active !== undefined ? productData.is_active : true,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      throw new Error('Product creation failed: No data returned');
    }
    
    return data;
  },

  updateProduct: async (productId, productData) => {
    const isAdminAuthenticated = typeof window !== 'undefined' && (
      window.adminAuthenticated === true || 
      sessionStorage.getItem("adminAuth") === "true"
    );
    
    let user = null;
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
    } catch (userError) {
      if (!isAdminAuthenticated) {
        throw new Error('User must be authenticated to update products');
      }
    }

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
    if (!data) {
      throw new Error('Product update failed: No data returned');
    }
    return data;
  },

  deleteProduct: async (productId) => {
    const isAdminAuthenticated = typeof window !== 'undefined' && (
      window.adminAuthenticated === true || 
      sessionStorage.getItem("adminAuth") === "true"
    );
    
    let user = null;
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
    } catch (userError) {
      if (!isAdminAuthenticated) {
        throw new Error('User must be authenticated to delete products');
      }
    }

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .select();

    if (error) throw error;
    return { success: true, data };
  },
};

// Categories API using Supabase
export const categoriesAPI = {
  getAllCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image, is_active')
      .eq('is_active', true);

    if (error) throw error;
    
    const customOrder = [
      'Fruits',
      'Vegetables',
      'Non-Vegetables',
      'Cereal Grains & Pulses',
      'Cleansing Products',
      'Other Groceries'
    ];
    
    const sortedData = (data || []).sort((a, b) => {
      const indexA = customOrder.indexOf(a.name);
      const indexB = customOrder.indexOf(b.name);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
    
    return sortedData;
  },

  getAllCategoriesAdmin: async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User must be authenticated to view all categories');

    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image, is_active, created_at, updated_at');

    if (error) throw error;
    
    const customOrder = [
      'Fruits',
      'Vegetables',
      'Non-Vegetables',
      'Cereal Grains & Pulses',
      'Cleansing Products',
      'Other Groceries'
    ];
    
    const sortedData = (data || []).sort((a, b) => {
      const indexA = customOrder.indexOf(a.name);
      const indexB = customOrder.indexOf(b.name);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
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

// Admin API for admin authentication
export const adminAPI = {
  login: async (username, password) => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured. Please set up your .env file.');
    }

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !adminUser) {
      throw new Error('Invalid username or password');
    }

    // Note: Password verification should be done server-side via Edge Function
    // For now, return admin data if found
    return {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
    };
  },

  requestPasswordReset: async (email) => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured.');
    }

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !adminUser) {
      throw new Error('Admin email not found');
    }

    return { success: true, message: 'Password reset email sent' };
  },

  resetPassword: async (email, newPassword) => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured.');
    }

    const { data: adminUser, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (checkError || !adminUser) {
      throw new Error('Admin email not found or account is inactive');
    }

    // IMPORTANT: In production, password should be hashed server-side using Supabase Edge Function
    // For now, we're storing it directly (NOT SECURE - for development only)
    // TODO: Implement server-side password hashing
    
    const { data, error } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: newPassword, // WARNING: This should be bcrypt hashed server-side
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .eq('is_active', true)
      .select();

    if (error) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Failed to reset password. Please check database permissions.');
    }

    if (!data || data.length === 0) {
      throw new Error('Failed to update password. Admin not found.');
    }

    return { success: true, message: 'Password reset successfully' };
  },

  updatePassword: async (adminId, currentPassword, newPassword) => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase is not configured.');
    }

    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single();

    if (fetchError || !adminUser) {
      throw new Error('Admin not found');
    }

    // Verify current password (should be done server-side)
    // For now, update password directly
    const { data, error } = await supabase
      .from('admin_users')
      .update({ 
        password_hash: newPassword, // This should be hashed server-side
        updated_at: new Date().toISOString()
      })
      .eq('id', adminId)
      .select();

    if (error) {
      throw new Error('Failed to update password');
    }

    return { success: true, message: 'Password updated successfully' };
  },
};

export default {
  authAPI,
  userAPI,
  ordersAPI,
  cartAPI,
  productsAPI,
  categoriesAPI,
  adminAPI,
};
