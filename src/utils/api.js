const API_BASE_URL = 'http://localhost:3001/api';

// Cart API
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        'Content-Type': 'application/json',
        'sessionid': getSessionId()
      },
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    const cartData = await response.json();
    return cartData.items || [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

export const addToCartAPI = async (product, quantity = 1, selectedColor = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'sessionid': getSessionId()
      },
      body: JSON.stringify({ 
        productId: product._id || product.id, 
        quantity, 
        selectedColor 
      }),
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    const cartData = await response.json();
    return cartData.items || [];
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'sessionid': getSessionId()
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error('Failed to update cart item');
    const cartData = await response.json();
    return cartData.items || [];
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'sessionid': getSessionId()
      },
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    const cartData = await response.json();
    return cartData.items || [];
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'sessionid': getSessionId()
      },
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return await response.json();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Products API
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Orders API
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// User Authentication API
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to register user');
    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Failed to login');
    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Initialize products in database
export const initializeProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/init-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to initialize products');
    return await response.json();
  } catch (error) {
    console.error('Error initializing products:', error);
    throw error;
  }
};
