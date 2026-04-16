import React, { useState, useEffect } from 'react';
import { GlobalStyle } from './utils/styles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import ProductPage from './pages/ProductPage';

// Error Fallback
function ErrorFallback({ error, resetError }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '40px',
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#333',
      background: '#f5f0e8'
    }}>
      <h2 style={{ color: '#c33' }}>⚠️ Error Loading Website</h2>
      <p style={{ marginBottom: '20px', background: '#fee', padding: '10px', borderRadius: '4px' }}>
        {error?.message || 'Unknown error'}
      </p>
      <p>Please try:</p>
      <ul>
        <li>Refreshing the page (F5)</li>
        <li>Checking browser console for errors</li>
        <li>Clearing browser cache</li>
      </ul>
      <button 
        onClick={resetError}
        style={{
          padding: '12px 24px',
          background: '#8B4513',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          marginTop: '20px',
          fontFamily: 'monospace'
        }}
      >
        Retry Loading
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error);
      setError(event.error);
      event.preventDefault();
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return <ErrorFallback error={error} resetError={() => { setError(null); window.location.reload(); }} />;
  }

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    // Require login to add to cart
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    
    const existingItem = cart.find(item => 
      item._id === product._id && item.selectedColor === selectedColor
    );
    
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id && item.selectedColor === selectedColor
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity, selectedColor }]);
    }
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setPage('product');
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onAdd={addToCart} onView={viewProduct} setPage={setPage} />;
      case 'shop':
        return <ShopPage onAdd={addToCart} onView={viewProduct} />;
      case 'product':
        return <ProductPage product={selectedProduct} onAdd={addToCart} setPage={setPage} user={user} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'profile':
        return user ? <ProfilePage user={user} onLogout={handleLogout} setPage={setPage} /> : <HomePage onAdd={addToCart} onView={viewProduct} setPage={setPage} />;
      case 'cart':
        return <CartPage 
          cart={cart} 
          onUpdateQuantity={updateQuantity} 
          onRemove={removeFromCart} 
          onCheckout={(address) => { 
            setSelectedAddress(address);
            setPage('payment'); 
          }} 
          setPage={setPage} 
        />;
      case 'payment':
        return <PaymentPage 
          cart={cart} 
          selectedAddress={selectedAddress} 
          onOrderComplete={() => { 
            setCart([]); 
            setSelectedAddress(null);
          }} 
          setPage={setPage} 
        />;
      default:
        return <HomePage onAdd={addToCart} onView={viewProduct} setPage={setPage} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar
          currentPage={page}
          onCartClick={() => setPage('cart')}
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onAuthClick={() => setIsAuthOpen(true)}
          user={user}
          onLogout={handleLogout}
          setPage={setPage}
        />
        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
        <Footer />
      </div>

      {isAuthOpen && (
        <AuthPage
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setIsAuthOpen(false)}
        />
      )}
    </>
  );
}
