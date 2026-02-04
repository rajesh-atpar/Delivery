import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL and Anon Key are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client with proper configuration to prevent AbortError
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'puscart-delivery',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to retry failed requests (excluding AbortErrors)
const retryRequest = async (fn, maxRetries = 2, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on AbortError - it means the request was cancelled
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Request was cancelled. Please try again.');
      }
      
      // Don't retry on permission errors
      if (error.code === '42501' || error.code === 'PGRST301') {
        throw error;
      }
      
      // If it's the last attempt, throw the error
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError;
};

// Helper function to wrap requests with better error handling
const safeRequest = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    // Handle AbortError specifically
    if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('signal is aborted')) {
      throw new Error('Request was cancelled. Please try again.');
    }
    
    // Re-throw other errors as-is
    throw error;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    return await safeRequest(async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// Helper function to get user profile from profiles table
export const getUserProfile = async (userId) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  try {
    return await safeRequest(async () => {
      // Check if user is authenticated first
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      // If not authenticated, try without auth (for admin users)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle missing profiles
      
      // If profile doesn't exist (PGRST116), return null
      if (error && error.code === 'PGRST116') {
        return null;
      }
      
      // If 406 error (Not Acceptable), it's likely an RLS issue
      if (error && (error.code === '406' || error.message?.includes('Not Acceptable'))) {
        console.warn('Profile fetch returned 406 - RLS may be blocking. Returning null.');
        return null;
      }
      
      // If other error, throw it
      if (error) {
        throw error;
      }
      
      return data;
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Don't throw - return null so app can continue
    return null;
  }
};

// Helper function to create or update user profile
export const upsertUserProfile = async (userId, profileData) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  try {
    return await safeRequest(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  } catch (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }
};

// Products helper functions
export const getProducts = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  try {
    return await safeRequest(async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    });
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  try {
    return await retryRequest(async () => {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Provide more helpful error messages
    if (error.message?.includes('cancelled') || error.message?.includes('aborted')) {
      throw new Error('Request was cancelled. Please try again.');
    } else if (error.code === '42501') {
      throw new Error('Permission denied. Please check your database permissions.');
    } else if (error.code === '23505') {
      throw new Error('A product with this name already exists.');
    } else if (error.message) {
      throw error;
    }
    
    throw new Error('Failed to create product. Please try again.');
  }
};

export const updateProduct = async (productId, productData) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  try {
    return await safeRequest(async () => {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set up your .env file.');
  }

  try {
    return await safeRequest(async () => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      return { success: true };
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export default supabase;
