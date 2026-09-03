import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, ShoppingCart, Heart, Sun, Moon, 
  User, BookOpen, Compass, Shield,
  LogOut, CheckCircle2, Sparkles, ChevronDown, 
  LogIn, Menu, X, ArrowRight
} from 'lucide-react';

export default function Header() {
  const { 
    theme, toggleTheme,
    currentUser, logout,
    cart, wishlist,
    activeView, navigateTo,
    searchQuery, setSearchQuery, recordSearch,
    setIsCartOpen, setIsAuthOpen, setAuthMode,
    setIsWishlistOpen, setIsFinderOpen,
    adminUnlocked
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin' || adminUnlocked;

  // Scroll Shadow Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus mobile search when opened
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (activeView !== 'catalog') {
      navigateTo('catalog');
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      recordSearch(searchQuery);
      setIsMobileSearchOpen(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleMobileNavClick = (view) => {
    navigateTo(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={isScrolled ? 'scrolled' : ''}>
        <div className="wrap header-inner">
          
          {/* Left: Mobile Menu Trigger + Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <button
              className="btn-icon mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              title="Menu"
              style={{ position: 'relative', flexShrink: 0 }}
            >
              {isMobileMenuOpen ? (
                <X size={20} />
              ) : currentUser ? (
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getInitials(currentUser.name)}
                </div>
              ) : (
                <Menu size={20} />
              )}
            </button>

            {/* Customer Store Brand (Always Clear & Prominent) */}
            <div className="brand" onClick={() => navigateTo('catalog')}>
              <div className="brand-mark">005.1</div>
              <div className="brand-text-group">
                <div className="brand-name">Node<em>Lib</em></div>
                <span className="brand-byline">by Lotus &amp; Lithium</span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="main-nav desktop-nav">
            <button 
              className={`nav-link ${activeView === 'catalog' ? 'active' : ''}`}
              onClick={() => navigateTo('catalog')}
            >
              Explore
            </button>
            
            <button 
              className={`nav-link ${activeView === 'library' ? 'active' : ''}`}
              onClick={() => navigateTo('library')}
            >
              <BookOpen size={15} /> My Library
            </button>

            <button 
              className={`nav-link ${activeView === 'insights' ? 'active' : ''}`}
              onClick={() => navigateTo('insights')}
            >
              Reading Insights
            </button>

            {/* Admin link ONLY rendered if user has authenticated as Admin */}
            {isAdmin && (
              <button 
                className={`nav-link ${activeView === 'admin' ? 'active' : ''}`}
                onClick={() => navigateTo('admin')}
                style={{
                  color: 'var(--rose)',
                  background: 'var(--rose-bg)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  fontWeight: 700
                }}
              >
                <Shield size={14} /> Admin Portal
              </button>
            )}
          </nav>

          {/* Desktop Live Search Bar */}
          <div className="smart-search desktop-search">
            <span className="smart-search-icon"><Search size={15} /></span>
            <input 
              type="text" 
              placeholder="Search books, topics, authors..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search Catalog"
            />
          </div>

          {/* Right: Header Actions Row */}
          <div className="header-actions">
            
            {/* Mobile Search Toggle Button */}
            <button 
              className={`btn-icon mobile-search-trigger ${isMobileSearchOpen ? 'active' : ''}`} 
              onClick={() => setIsMobileSearchOpen(prev => !prev)}
              title="Search"
              aria-label="Toggle Search"
              style={{
                background: isMobileSearchOpen ? 'var(--primary-light)' : undefined,
                color: isMobileSearchOpen ? 'var(--primary)' : undefined,
                borderColor: isMobileSearchOpen ? 'var(--primary)' : undefined
              }}
            >
              <Search size={17} />
            </button>

            {/* Smart Finder Quiz Trigger (Desktop) */}
            <button 
              className="btn-icon desktop-finder-btn" 
              onClick={() => setIsFinderOpen(true)}
              title="Book Finder Wizard"
              aria-label="Find My Book"
            >
              <Compass size={17} />
            </button>

            {/* Customer Wishlist (Desktop) */}
            <button 
              className="btn-icon desktop-wishlist-btn" 
              onClick={() => setIsWishlistOpen(true)}
              title="Saved Wishlist"
              style={{ position: 'relative' }}
              aria-label="Wishlist"
            >
              <Heart size={17} />
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--rose)',
                  color: '#FFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer */}
            <button 
              className="cart-btn" 
              onClick={() => setIsCartOpen(true)}
              title="Shopping Cart"
            >
              <ShoppingCart size={16} />
              <span className="cart-btn-label">Cart</span>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </button>

            {/* Dark / Light Mode Switch (Desktop) */}
            <button 
              className="btn-icon desktop-theme-btn" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Customer Account & Profile (Desktop Only - on mobile it lives inside Hamburger Drawer) */}
            <div className="profile-menu-wrap desktop-profile-wrap" ref={profileRef}>
              {currentUser ? (
                <button 
                  className="btn btn-ghost btn-sm profile-pill-btn"
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  title="Account Menu"
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getInitials(currentUser.name)}
                  </div>
                  <span className="profile-btn-name">
                    {currentUser.name}
                  </span>
                  <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
                </button>
              ) : (
                <button 
                  className="btn btn-primary btn-sm signin-header-btn"
                  onClick={() => {
                    setAuthMode('signin');
                    setIsAuthOpen(true);
                  }}
                >
                  <LogIn size={15} /> <span>Sign In</span>
                </button>
              )}

              {/* Desktop Profile Dropdown */}
              {currentUser && isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-head">
                    <div className="profile-dropdown-name">{currentUser.name}</div>
                    <div className="profile-dropdown-email">{currentUser.email}</div>
                    <span className="profile-dropdown-badge">
                      {currentUser.role === 'admin' ? '🛡 Store Admin' : '✓ Active Member'}
                    </span>
                  </div>

                  <button 
                    className="profile-dropdown-item"
                    onClick={() => {
                      navigateTo('library');
                      setIsProfileOpen(false);
                    }}
                  >
                    <BookOpen size={15} /> My Digital Library
                  </button>

                  <button 
                    className="profile-dropdown-item"
                    onClick={() => {
                      navigateTo('orders');
                      setIsProfileOpen(false);
                    }}
                  >
                    <CheckCircle2 size={15} /> Order Invoices
                  </button>

                  {isAdmin && (
                    <>
                      <div className="profile-divider" />
                      <button 
                        className="profile-dropdown-item"
                        style={{ color: 'var(--rose)', fontWeight: 700 }}
                        onClick={() => {
                          navigateTo('admin');
                          setIsProfileOpen(false);
                        }}
                      >
                        <Shield size={15} /> Owner & Admin Console
                      </button>
                    </>
                  )}

                  <div className="profile-divider" />

                  <button 
                    className="profile-dropdown-item danger"
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Animated Mobile Search Bar Overlay */}
        {isMobileSearchOpen && (
          <div className="mobile-search-bar-wrap animate-search-slide-down">
            <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="smart-search" style={{ flex: 1, maxWidth: '100%' }}>
                <span className="smart-search-icon"><Search size={16} /></span>
                <input 
                  ref={mobileSearchRef}
                  type="text" 
                  placeholder="Search titles, authors, topics..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  autoComplete="off"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ color: 'var(--text-muted)', padding: '2px 4px', fontSize: '12px', fontWeight: 700 }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <button 
                className="btn-icon" 
                onClick={() => setIsMobileSearchOpen(false)}
                title="Close Search"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-backdrop animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            
            {/* Mobile Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="brand" onClick={() => handleMobileNavClick('catalog')}>
                <div className="brand-mark">005.1</div>
                <div className="brand-text-group">
                  <div className="brand-name">Node<em>Lib</em></div>
                  <span className="brand-byline">by Lotus &amp; Lithium</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Mobile User Profile Section (Top of Drawer) */}
            <div style={{
              padding: '16px 18px',
              background: 'var(--surface-subtle)',
              borderBottom: '1px solid var(--border)'
            }}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px var(--primary-glow)',
                    flexShrink: 0
                  }}>
                    {getInitials(currentUser.name)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser.email}
                    </div>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '99px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      marginTop: '3px'
                    }}>
                      {currentUser.role === 'admin' ? '🛡 Store Admin' : '✓ Active Member'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    Sign in to sync your library and purchases:
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', gap: '6px' }}
                    onClick={() => {
                      setAuthMode('signin');
                      setIsAuthOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogIn size={14} /> Sign In / Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Nav Links */}
            <div className="mobile-drawer-links">
              <button 
                className={`mobile-drawer-link ${activeView === 'catalog' ? 'active' : ''}`}
                onClick={() => handleMobileNavClick('catalog')}
              >
                <span>Explore Catalog</span>
                <ArrowRight size={15} />
              </button>

              <button 
                className={`mobile-drawer-link ${activeView === 'library' ? 'active' : ''}`}
                onClick={() => handleMobileNavClick('library')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={16} /> My Digital Library
                </span>
                <ArrowRight size={15} />
              </button>

              <button 
                className={`mobile-drawer-link ${activeView === 'orders' ? 'active' : ''}`}
                onClick={() => handleMobileNavClick('orders')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} /> Order Invoices
                </span>
                <ArrowRight size={15} />
              </button>

              <button 
                className={`mobile-drawer-link ${activeView === 'insights' ? 'active' : ''}`}
                onClick={() => handleMobileNavClick('insights')}
              >
                <span>Reading Insights</span>
                <ArrowRight size={15} />
              </button>

              <button 
                className="mobile-drawer-link"
                onClick={() => {
                  setIsFinderOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={16} /> Smart Book Finder
                </span>
                <ArrowRight size={15} />
              </button>

              <button 
                className="mobile-drawer-link"
                onClick={() => {
                  setIsWishlistOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={16} /> Saved Wishlist ({wishlist.length})
                </span>
                <ArrowRight size={15} />
              </button>

              {isAdmin && (
                <button 
                  className={`mobile-drawer-link ${activeView === 'admin' ? 'active' : ''}`}
                  onClick={() => handleMobileNavClick('admin')}
                  style={{ color: 'var(--rose)', fontWeight: 800 }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} /> Store Owner Console
                  </span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>

            {/* Mobile Drawer Footer with Theme Toggle & Sign Out */}
            <div className="mobile-drawer-footer">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Appearance
                </span>
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={toggleTheme}
                  style={{ gap: '6px' }}
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              {currentUser && (
                <button 
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', marginTop: '14px', color: 'var(--rose)', borderColor: 'rgba(244, 63, 94, 0.25)' }}
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
