import React from 'react';
import { GlobalStyle } from './utils/styles';

export default function TestImport() {
  // Test imports in useEffect to avoid manifest issues
  React.useEffect(() => {
    console.log('Testing imports...');
    
    try {
      const Navbar = require('./components/Navbar').default;
      console.log('✓ Navbar imported');
    } catch (e) {
      console.error('✗ Navbar error:', e.message);
    }
    
    try {
      const Footer = require('./components/Footer').default;
      console.log('✓ Footer imported');
    } catch (e) {
      console.error('✗ Footer error:', e.message);
    }
    
    try {
      const HomePage = require('./pages/HomePage').default;
      console.log('✓ HomePage imported');
    } catch (e) {
      console.error('✗ HomePage error:', e.message);
    }
    
    try {
      const ShopPage = require('./pages/ShopPage').default;
      console.log('✓ ShopPage imported');
    } catch (e) {
      console.error('✗ ShopPage error:', e.message);
    }
    
    try {
      const AboutPage = require('./pages/AboutPage').default;
      console.log('✓ AboutPage imported');
    } catch (e) {
      console.error('✗ AboutPage error:', e.message);
    }
    
    try {
      const ContactPage = require('./pages/ContactPage').default;
      console.log('✓ ContactPage imported');
    } catch (e) {
      console.error('✗ ContactPage error:', e.message);
    }
    
    try {
      const CartDrawer = require('./components/CartDrawer').default;
      console.log('✓ CartDrawer imported');
    } catch (e) {
      console.error('✗ CartDrawer error:', e.message);
    }
    
    try {
      const ProductModal = require('./components/ProductModal').default;
      console.log('✓ ProductModal imported');
    } catch (e) {
      console.error('✗ ProductModal error:', e.message);
    }
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Import Test Page</h1>
      <p>Check browser console (F12) for import results</p>
      <p>If you see this, React is working fine.</p>
    </div>
  );
}
