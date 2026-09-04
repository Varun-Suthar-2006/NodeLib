import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CatalogView from './components/CatalogView';
import ProductDetailPage from './components/ProductDetailPage';
import LibraryView from './components/LibraryView';
import OrdersView from './components/OrdersView';
import InsightsView from './components/InsightsView';
import { AboutView, FaqView, ContactView, Footer } from './components/InfoPages';
import { TermsView, PrivacyView, RefundPolicyView, ShippingPolicyView } from './components/PolicyPages';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReaderModal from './components/ReaderModal';
import SmartFinderModal from './components/SmartFinderModal';
import WishlistModal from './components/WishlistModal';
import AuthModal from './components/AuthModal';
import EmailVerificationModal from './components/EmailVerificationModal';
import AdminDashboard from './components/AdminDashboard';
import AdminBookModal from './components/AdminBookModal';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import Toast from './components/Toast';

export default function App() {
  const { activeView, isSupabaseModalOpen, setIsSupabaseModalOpen } = useApp();

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Header />

      {/* Main Routed Content */}
      <main style={{ flex: 1 }}>
        {activeView === 'catalog' && (
          <>
            <Hero />
            <CatalogView />
          </>
        )}

        {activeView === 'product' && <ProductDetailPage />}
        {activeView === 'library' && <LibraryView />}
        {activeView === 'orders' && <OrdersView />}
        {activeView === 'insights' && <InsightsView />}
        {activeView === 'about' && <AboutView />}
        {activeView === 'faq' && <FaqView />}
        {activeView === 'contact' && <ContactView />}
        {activeView === 'terms' && <TermsView />}
        {activeView === 'privacy' && <PrivacyView />}
        {activeView === 'refund-policy' && <RefundPolicyView />}
        {activeView === 'shipping-policy' && <ShippingPolicyView />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ReaderModal />
      <SmartFinderModal />
      <WishlistModal />
      <AuthModal />
      <EmailVerificationModal />
      <AdminBookModal />
      <SupabaseConfigModal 
        isOpen={isSupabaseModalOpen} 
        onClose={() => setIsSupabaseModalOpen(false)} 
      />

      {/* Floating Action Notifications */}
      <Toast />
    </div>
  );
}
