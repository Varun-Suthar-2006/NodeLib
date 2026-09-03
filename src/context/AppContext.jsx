import React, { createContext, useContext, useState, useEffect } from 'react';
import { SEED_BOOKS, MEMBERSHIP_PLANS } from '../data/seedBooks';
import { dbService } from '../services/dbService';
import confetti from 'canvas-confetti';

const AppContext = createContext();

const STORAGE_KEYS = {
  STATE: 'nodelib_v2_state',
  CATALOG: 'nodelib_v2_catalog',
  ACTIVITY: 'nodelib_v2_activity',
  THEME: 'nodelib_v2_theme'
};

export function AppProvider({ children }) {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  });

  // User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentUser || null;
      }
    } catch (e) {}
    return null;
  });

  // Library & Cart & Wishlist & Orders
  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) return JSON.parse(saved).library || [];
    } catch (e) {}
    return [];
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) return JSON.parse(saved).cart || [];
    } catch (e) {}
    return [];
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) return JSON.parse(saved).wishlist || [];
    } catch (e) {}
    return [];
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) return JSON.parse(saved).orders || [];
    } catch (e) {}
    return [];
  });

  const [subscription, setSubscription] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATE);
      if (saved) return JSON.parse(saved).subscription || { plan: 'free', status: 'active' };
    } catch (e) {}
    return { plan: 'free', status: 'active' };
  });

  // Activity Tracking
  const [activity, setActivity] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { views: {}, searches: [], cartAdds: {}, purchases: {}, categories: {} };
  });

  // Dynamic Books List
  const [books, setBooks] = useState(SEED_BOOKS);

  // Catalog Overrides for Local Fallback
  const [catalogOverrides, setCatalogOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATALOG);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { customBooks: {}, edits: {}, deletedIds: [] };
  });

  // Active View & Navigation
  const [activeView, setActiveView] = useState('catalog');
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [readingBookId, setReadingBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [demoOtp, setDemoOtp] = useState('849201');
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [adminEditingBook, setAdminEditingBook] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Sync Books from Supabase or Catalog Overrides
  useEffect(() => {
    async function loadBooks() {
      if (dbService.isConfigured()) {
        const remoteBooks = await dbService.fetchBooks();
        if (remoteBooks && remoteBooks.length > 0) {
          setBooks(remoteBooks);
          return;
        }
      }
      // Local fallback calculation
      const base = SEED_BOOKS
        .filter(b => !catalogOverrides.deletedIds.includes(b.id))
        .map(b => ({ ...b, ...(catalogOverrides.edits[b.id] || {}) }));
      const custom = Object.values(catalogOverrides.customBooks || {});
      setBooks([...base, ...custom]);
    }
    loadBooks();
  }, [catalogOverrides]);

  // Sync Active User Data from Supabase
  useEffect(() => {
    async function initUser() {
      if (dbService.isConfigured()) {
        const user = await dbService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          const [userOrders, userLib, userWish, userSub] = await Promise.all([
            dbService.fetchUserOrders(user.id),
            dbService.fetchUserLibrary(user.id),
            dbService.fetchWishlist(user.id),
            dbService.fetchSubscription(user.id)
          ]);
          if (userOrders && userOrders.length > 0) setOrders(userOrders);
          if (userLib && userLib.length > 0) setLibrary(userLib);
          if (userWish && userWish.length > 0) setWishlist(userWish);
          if (userSub) setSubscription(userSub);
        }
      }
    }
    initUser();
  }, []);

  // Compute Tags
  const allTags = React.useMemo(() => {
    const tags = new Set();
    books.forEach(b => {
      if (Array.isArray(b.tags)) b.tags.forEach(t => tags.add(t));
    });
    return ['all', ...Array.from(tags)];
  }, [books]);

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Sync State to LocalStorage
  useEffect(() => {
    const stateObj = { currentUser, library, cart, wishlist, orders, subscription };
    localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(stateObj));
  }, [currentUser, library, cart, wishlist, orders, subscription]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
  }, [activity]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(catalogOverrides));
  }, [catalogOverrides]);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollBar = document.getElementById('scroll-progress');
      if (scrollBar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        scrollBar.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast Trigger
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  };

  // Activity Tracking Helpers
  const recordView = (id) => {
    setActivity(prev => {
      const nextViews = { ...prev.views, [id]: (prev.views[id] || 0) + 1 };
      const book = books.find(b => b.id === id);
      const nextCats = { ...prev.categories };
      if (book && book.tags && book.tags[0]) {
        nextCats[book.tags[0]] = (nextCats[book.tags[0]] || 0) + 1;
      }
      return { ...prev, views: nextViews, categories: nextCats };
    });
  };

  const recordSearch = (q) => {
    if (!q || !q.trim()) return;
    setActivity(prev => ({
      ...prev,
      searches: [q.trim(), ...prev.searches.filter(s => s !== q.trim())].slice(0, 30)
    }));
  };

  // Cart Helpers
  const addToCart = (id) => {
    const book = books.find(b => b.id === id);
    if (!book) return;
    if (book.stock <= 0 && !library.includes(id)) {
      showToast('This book is currently out of stock.', 'error');
      return;
    }
    if (!cart.includes(id)) {
      setCart(prev => [...prev, id]);
      setActivity(prev => ({
        ...prev,
        cartAdds: { ...prev.cartAdds, [id]: (prev.cartAdds[id] || 0) + 1 }
      }));
      showToast(`Added "${book.title}" to cart`, 'success');
    } else {
      showToast(`"${book.title}" is already in your cart`);
    }
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item !== id));
    showToast('Removed from cart');
  };

  const clearCart = () => setCart([]);

  // Wishlist Helpers
  const toggleWishlist = async (id) => {
    const book = books.find(b => b.id === id);
    const isAdding = !wishlist.includes(id);
    if (isAdding) {
      setWishlist(prev => [...prev, id]);
      showToast(`Saved "${book?.title || 'Book'}" to wishlist ♥`, 'success');
    } else {
      setWishlist(prev => prev.filter(item => item !== id));
      showToast(`Removed "${book?.title || 'Book'}" from wishlist`);
    }
    if (currentUser?.id) {
      await dbService.toggleWishlist(currentUser.id, id, isAdding);
    }
  };

  const isWishlisted = (id) => wishlist.includes(id);

  // Navigation & Page Views
  const navigateTo = (view, bookId = null) => {
    setActiveView(view);
    if (view === 'product' && bookId) {
      setSelectedBookId(bookId);
      recordView(bookId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openReader = (bookId) => {
    if (!library.includes(bookId)) {
      showToast('Unlock this title in your library first to read it.');
      return;
    }
    setReadingBookId(bookId);
  };

  const closeReader = () => setReadingBookId(null);

  // Checkout Flow
  const startCheckout = (itemIds) => {
    if (!currentUser) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      showToast('Please sign in or create an account to purchase.');
      return;
    }
    setCheckoutItems(itemIds);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Process Payment with Complete Transaction & Analytics Logging
  const processPayment = async (gateway = 'RAZORPAY', txnRef = null, methodDetails = {}) => {
    const userToCharge = currentUser || {
      id: 'guest-' + Date.now(),
      email: 'customer@store.io',
      name: 'Valued Customer'
    };

    const purchasedBooks = checkoutItems.map(id => books.find(b => b.id === id)).filter(Boolean);
    const subtotal = purchasedBooks.reduce((sum, b) => sum + b.price, 0);
    
    const discount = 0;
    const total = subtotal;

    // Update library & orders locally
    const newLibraryIds = [...new Set([...library, ...checkoutItems])];
    setLibrary(newLibraryIds);
    setCart(prev => prev.filter(id => !checkoutItems.includes(id)));

    const generatedTxnRef = txnRef || (`pay_${Math.random().toString(36).substring(2, 12)}`);

    const newOrder = {
      id: 'NLB-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: checkoutItems,
      total,
      subtotal,
      discount,
      status: 'Delivered',
      paymentMethod: (gateway || 'RAZORPAY').toUpperCase(),
      transactionRef: generatedTxnRef
    };
    setOrders(prev => [newOrder, ...prev]);

    // Persist to Supabase Orders & Payments Analytics
    await dbService.createOrder(
      newOrder, 
      purchasedBooks, 
      { transactionRef: generatedTxnRef, methodDetails }, 
      userToCharge.id, 
      userToCharge.email
    );

    // Update activity purchases
    setActivity(prev => {
      const nextPurchases = { ...prev.purchases };
      checkoutItems.forEach(id => {
        nextPurchases[id] = (nextPurchases[id] || 0) + 1;
      });
      return { ...prev, purchases: nextPurchases };
    });

    setIsCheckoutOpen(false);
    
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    showToast(`Payment successful! ₹${total} paid via ${gateway.toUpperCase()} (${generatedTxnRef}). Added to My Library.`, 'success');
  };

  // Membership Activation
  const activatePlan = async (planId) => {
    const subObj = {
      plan: planId,
      status: 'active',
      started: new Date().toISOString()
    };
    setSubscription(subObj);
    if (currentUser?.id) {
      await dbService.updateSubscription(currentUser.id, planId);
    }
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
    showToast(`NodeLib ${planId.toUpperCase()} Membership activated! Discounts applied.`, 'success');
  };

  // Authentication Flow
  const handleAuthSubmit = async (email, name, password, mode) => {
    if (mode === 'signup') {
      if (dbService.isConfigured()) {
        const { user, error } = await dbService.signUp(email, password, name);
        if (error) {
          showToast(error, 'error');
          return;
        }
        if (user) {
          setCurrentUser({ id: user.id, email: user.email, name: name || user.email.split('@')[0], role: 'customer' });
          setIsAuthOpen(false);
          showToast(`Account created! Welcome to NodeLib, ${name || email.split('@')[0]}!`, 'success');
          return;
        }
      }
      const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
      setDemoOtp(generatedCode);
      setPendingUser({ email, name: name || email.split('@')[0], password });
      setIsAuthOpen(false);
      setIsVerificationOpen(true);
      showToast(`Verification code generated: ${generatedCode}`, 'info');
    } else {
      if (dbService.isConfigured()) {
        const { user, error } = await dbService.signIn(email, password);
        if (error) {
          showToast(error, 'error');
          return;
        }
        if (user) {
          const profile = await dbService.getCurrentUser();
          setCurrentUser(profile || { id: user.id, email: user.email, name: email.split('@')[0], role: 'customer' });
          setIsAuthOpen(false);
          showToast(`Welcome back, ${profile?.name || email.split('@')[0]}!`, 'success');
          return;
        }
      }
      setCurrentUser({
        id: 'local-' + Date.now(),
        email,
        name: name || email.split('@')[0],
        emailVerified: true
      });
      setIsAuthOpen(false);
      showToast(`Welcome back, ${name || email.split('@')[0]}!`, 'success');
    }
  };

  const verifyOtpCode = (enteredOtp) => {
    if (!pendingUser) return false;
    if (enteredOtp.trim() === demoOtp.trim()) {
      setCurrentUser({
        id: 'local-' + Date.now(),
        email: pendingUser.email,
        name: pendingUser.name,
        emailVerified: true
      });
      setIsVerificationOpen(false);
      setPendingUser(null);
      showToast(`Email verified! Welcome to NodeLib, ${pendingUser.name}!`, 'success');
      return true;
    }
    return false;
  };

  const logout = async () => {
    await dbService.signOut();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  // Admin Catalog CRUD with Supabase
  const saveAdminBook = async (bookData, editingId = null) => {
    if (editingId) {
      if (dbService.isConfigured()) {
        try {
          await dbService.updateBook(editingId, bookData);
        } catch (e) {}
      }
      const isSeed = SEED_BOOKS.some(s => s.id === editingId);
      if (isSeed) {
        setCatalogOverrides(prev => ({
          ...prev,
          edits: { ...prev.edits, [editingId]: bookData }
        }));
      } else {
        setCatalogOverrides(prev => ({
          ...prev,
          customBooks: { ...prev.customBooks, [editingId]: { id: editingId, ...bookData } }
        }));
      }
      showToast(`Updated "${bookData.title}" in catalog.`);
    } else {
      const slug = bookData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'book';
      let uniqueId = slug;
      let counter = 2;
      while (books.some(b => b.id === uniqueId)) {
        uniqueId = `${slug}-${counter}`;
        counter++;
      }
      const newBookObj = { id: uniqueId, ...bookData };
      if (dbService.isConfigured()) {
        try {
          await dbService.addBook(newBookObj);
        } catch (e) {}
      }
      setCatalogOverrides(prev => ({
        ...prev,
        customBooks: { ...prev.customBooks, [uniqueId]: newBookObj }
      }));
      showToast(`Added "${bookData.title}" to catalog.`, 'success');
    }
    setIsAdminFormOpen(false);
    setAdminEditingBook(null);
  };

  const deleteAdminBook = async (id) => {
    if (dbService.isConfigured()) {
      try {
        await dbService.deleteBook(id);
      } catch (e) {}
    }
    const isSeed = SEED_BOOKS.some(s => s.id === id);
    if (isSeed) {
      setCatalogOverrides(prev => ({
        ...prev,
        deletedIds: [...new Set([...prev.deletedIds, id])],
        edits: Object.fromEntries(Object.entries(prev.edits).filter(([k]) => k !== id))
      }));
    } else {
      setCatalogOverrides(prev => {
        const nextCustom = { ...prev.customBooks };
        delete nextCustom[id];
        return { ...prev, customBooks: nextCustom };
      });
    }
    showToast('Book removed from catalog.');
  };

  const clearSeedBooks = () => {
    setCatalogOverrides(prev => ({
      ...prev,
      deletedIds: SEED_BOOKS.map(b => b.id),
      edits: {}
    }));
    showToast('Sample books cleared from catalog.');
  };

  const resetCatalog = () => {
    setCatalogOverrides({ customBooks: {}, edits: {}, deletedIds: [] });
    showToast('Catalog reset to initial library defaults.');
  };

  // Recommendation Engine Helper
  const getScoredRecommendations = (limit = 4) => {
    const scored = books.map(b => {
      let score = 0;
      score += (activity.views[b.id] || 0) * 2;
      score += isWishlisted(b.id) ? 4 : 0;
      if (b.tags && b.tags[0]) {
        score += (activity.categories[b.tags[0]] || 0) * 1.5;
      }
      if (b.featured) score += 2;
      if (b.bestSeller) score += 1;
      return { book: b, score };
    }).sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.book);
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      currentUser, setCurrentUser, logout, handleAuthSubmit, verifyOtpCode,
      pendingUser, demoOtp,
      books, allTags, activeFilter, setActiveFilter,
      searchQuery, setSearchQuery, recordSearch,
      library, cart, addToCart, removeFromCart, clearCart,
      wishlist, toggleWishlist, isWishlisted,
      orders, subscription, activatePlan,
      activeView, setActiveView, navigateTo,
      selectedBookId, setSelectedBookId,
      readingBookId, setReadingBookId, openReader, closeReader,
      isCartOpen, setIsCartOpen,
      isAuthOpen, setIsAuthOpen, authMode, setAuthMode,
      isVerificationOpen, setIsVerificationOpen,
      isFinderOpen, setIsFinderOpen,
      isWishlistOpen, setIsWishlistOpen,
      isCheckoutOpen, setIsCheckoutOpen, checkoutItems, startCheckout, processPayment,
      selectedPayment, setSelectedPayment,
      isAdminFormOpen, setIsAdminFormOpen, adminEditingBook, setAdminEditingBook,
      adminUnlocked, setAdminUnlocked,
      isSupabaseModalOpen, setIsSupabaseModalOpen,
      isSupabaseConnected: dbService.isConfigured(),
      saveAdminBook, deleteAdminBook, clearSeedBooks, resetCatalog,
      activity, recordView, getScoredRecommendations,
      toast, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
