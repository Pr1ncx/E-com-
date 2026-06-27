import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BagProvider } from './context/BagContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutWizard from './components/CheckoutWizard';
import AuthModal from './components/AuthModal';
import ApiInterceptorConsole from './components/ApiInterceptorConsole';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <AuthProvider>
      <BagProvider>
        <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-indigo-600/10 selection:text-indigo-800">
          {/* Navigation & Announcement */}
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <main>
            {/* Hero Promotional Banner */}
            <Hero setSelectedCategory={setSelectedCategory} />
            
            {/* Main Shopify Grid Catalog */}
            <ProductCatalog
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onOpenQuickView={setActiveQuickViewProduct}
            />
            
            {/* Email Subscription banner */}
            <Newsletter />
          </main>

          {/* Brand footer details */}
          <Footer />

          {/* Slide-out Cart Sidebar Drawer */}
          <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

          {/* Quick View Detailed Overlay */}
          {activeQuickViewProduct && (
            <ProductDetailModal
              product={activeQuickViewProduct}
              onClose={() => setActiveQuickViewProduct(null)}
            />
          )}

          {/* Multi-step checkout form wizard */}
          <CheckoutWizard
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          {/* Login and Signup modal */}
          <AuthModal />

          {/* API Developer Interceptor Console Widget */}
          <ApiInterceptorConsole />
        </div>
      </BagProvider>
    </AuthProvider>
  );
}
