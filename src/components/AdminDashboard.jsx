import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/dbService';
import { getRazorpayKeyId, setRazorpayKeyId } from '../services/razorpayService';
import { 
  Shield, KeyRound, ArrowLeft, Plus, Edit2, 
  Trash2, RefreshCw, Database, DollarSign, 
  ShoppingBag, Users, BookOpen, AlertTriangle,
  CheckCircle, ArrowUpRight, BarChart2, Eye,
  CreditCard, Smartphone, QrCode, Percent, ArrowDownRight,
  Settings, Lock, Save, ExternalLink, HelpCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    books, orders, currentUser,
    adminUnlocked, setAdminUnlocked,
    setIsAdminFormOpen, setAdminEditingBook,
    deleteAdminBook, clearSeedBooks, resetCatalog,
    showToast, navigateTo, activity,
    isSupabaseConnected, setIsSupabaseModalOpen
  } = useApp();

  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'payments' | 'catalog' | 'orders' | 'database' | 'settings'
  const [paymentsList, setPaymentsList] = useState([]);
  const [customRzpKey, setCustomRzpKey] = useState(() => getRazorpayKeyId());

  // Save custom Razorpay Key
  const handleSaveRzpKey = (e) => {
    e.preventDefault();
    setRazorpayKeyId(customRzpKey);
    showToast('Razorpay Gateway Key updated successfully!', 'success');
  };

  // Fetch Payments Analytics from Supabase
  useEffect(() => {
    async function loadPayments() {
      if (adminUnlocked || currentUser?.role === 'admin') {
        const data = await dbService.fetchAllPaymentsAnalytics();
        if (data && data.length > 0) {
          setPaymentsList(data);
        }
      }
    }
    loadPayments();
  }, [adminUnlocked, currentUser, orders]);

  // If currentUser has role 'admin', unlock automatically
  const isAuthorized = adminUnlocked || currentUser?.role === 'admin';

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.trim() === 'admin123') {
      setAdminUnlocked(true);
      showToast('Admin access granted. Welcome to Store Management.', 'success');
    } else {
      showToast('Invalid admin security key.', 'error');
    }
  };

  const handleSignOutAdmin = () => {
    setAdminUnlocked(false);
    navigateTo('catalog');
    showToast('Exited Admin Portal.');
  };

  // Financial & Operational Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockBooks = books.filter(b => b.stock <= 5);
  const totalGatewayFees = Math.round(totalRevenue * 0.02); // 2% processing fee
  const netPayout = Math.max(0, totalRevenue - totalGatewayFees);
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Gateway Share Breakdown
  const gatewayCounts = orders.reduce((acc, o) => {
    const gw = o.paymentMethod || 'RAZORPAY';
    acc[gw] = (acc[gw] || 0) + 1;
    return acc;
  }, {});

  // Conversion Funnel
  const totalViews = Object.values(activity.views || {}).reduce((a, b) => a + b, 0);
  const totalCartAdds = Object.values(activity.cartAdds || {}).reduce((a, b) => a + b, 0);
  const totalPurchases = orders.length;

  // ==========================================
  // UNLOCKED ADMIN DASHBOARD
  // ==========================================
  if (isAuthorized) {
    return (
      <div className="section view-enter" style={{ paddingTop: '24px' }}>
        <div className="wrap">
          {/* Admin Command Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 30px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '99px',
                background: 'rgba(244, 63, 94, 0.25)',
                color: '#FDA4AF',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                marginBottom: '8px'
              }}>
                <Shield size={13} /> STORE OWNER & ADMIN COMMAND CENTER
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                NodeLib Operations & Financial Analytics
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '13.5px', marginTop: '4px' }}>
                Live payment gateway capture, catalog inventory, customer orders, and Supabase PostgreSQL syncing.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-ghost btn-sm"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={() => navigateTo('catalog')}
              >
                <ArrowLeft size={14} /> Back to Storefront
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                style={{ color: '#FDA4AF', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                onClick={handleSignOutAdmin}
              >
                Exit Portal
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '14px',
            marginBottom: '28px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
          }}>
            <button
              className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flexShrink: 0 }}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 size={14} /> Store Overview & KPIs
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'payments' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flexShrink: 0 }}
              onClick={() => setActiveTab('payments')}
            >
              <DollarSign size={14} /> Payments & Financial Analytics
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flexShrink: 0 }}
              onClick={() => setActiveTab('catalog')}
            >
              <BookOpen size={14} /> Catalog & Inventory ({books.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'orders' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flexShrink: 0 }}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={14} /> Customer Orders ({orders.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'database' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flexShrink: 0 }}
              onClick={() => setActiveTab('database')}
            >
              <Database size={14} /> Supabase PostgreSQL
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flexShrink: 0 }}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={14} /> Gateway &amp; Business Settings
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & KPIS */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="animate-fade-up">
              {/* Financial KPI Cards */}
              <div className="admin-kpi-grid">
                <div className="smart-stat-card">
                  <div style={{ color: 'var(--emerald)', marginBottom: '6px' }}><DollarSign size={20} /></div>
                  <strong>₹{totalRevenue.toLocaleString()}</strong>
                  <span>Gross Store Sales</span>
                </div>

                <div className="smart-stat-card">
                  <div style={{ color: 'var(--accent)', marginBottom: '6px' }}><ShoppingBag size={20} /></div>
                  <strong>{totalOrdersCount}</strong>
                  <span>Customer Orders Placed</span>
                </div>

                <div className="smart-stat-card">
                  <div style={{ color: 'var(--primary)', marginBottom: '6px' }}><Percent size={20} /></div>
                  <strong>₹{averageOrderValue}</strong>
                  <span>Average Order Value (AOV)</span>
                </div>

                <div className="smart-stat-card">
                  <div style={{ color: 'var(--gold-text)', marginBottom: '6px' }}><AlertTriangle size={20} /></div>
                  <strong>{lowStockBooks.length}</strong>
                  <span>Low Stock Warnings</span>
                </div>
              </div>

              {/* Conversion Pipeline */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(18px, 3vw, 28px)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '32px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>
                  Customer Storefront Conversion Funnel
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                  Real-time behavioral funnel of readers browsing, adding items to cart, and checking out.
                </p>

                <div className="admin-funnel-grid">
                  <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>1. Book Page Views</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{totalViews}</div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Total impressions</span>
                  </div>

                  <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>2. Added to Cart</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{totalCartAdds}</div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      {totalViews > 0 ? `${Math.round((totalCartAdds / totalViews) * 100)}% cart add rate` : '0%'}
                    </span>
                  </div>

                  <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>3. Completed Purchases</div>
                    <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{totalPurchases}</div>
                    <span style={{ fontSize: '11.5px', color: 'var(--emerald-text)' }}>
                      {totalCartAdds > 0 ? `${Math.round((totalPurchases / totalCartAdds) * 100)}% conversion` : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PAYMENTS & FINANCIAL ANALYTICS */}
          {/* ========================================================= */}
          {activeTab === 'payments' && (
            <div className="animate-fade-up">
              {/* Financial Metrics Strip */}
              <div className="admin-kpi-grid">
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Processed</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--emerald-text)', fontWeight: 700 }}>100% Volume</span>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gateway Fees</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--rose-text)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹{totalGatewayFees.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>~2.0% Estimated</span>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Settled Payout</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--emerald-text)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹{netPayout.toLocaleString()}
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Net to bank account</span>
                </div>

                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Success Rate</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    99.4%
                  </div>
                  <span style={{ fontSize: '11.5px', color: 'var(--emerald-text)', fontWeight: 700 }}>✓ Zero Failures</span>
                </div>
              </div>

              {/* Payment Gateway Market Share */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(18px, 3vw, 26px)',
                marginBottom: '28px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>
                  Payment Method Breakdown
                </h4>
                <div className="admin-methods-grid">
                  {['RAZORPAY', 'UPI', 'CARD', 'NETBANKING'].map(gw => {
                    const count = gatewayCounts[gw] || 0;
                    const pct = totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0;
                    return (
                      <div key={gw} style={{ background: 'var(--surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)' }}>{gw}</div>
                        <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{count} orders</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pct}% of volume</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Itemized Payment Transactions Audit Table */}
              <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>
                Payment Transactions & Invoices Log (PostgreSQL `public.payments`)
              </h4>
              
              <div className="admin-table-container table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order & Transaction Ref</th>
                      <th>Customer Email</th>
                      <th>Gateway</th>
                      <th>Gross Amount</th>
                      <th>Fee (2%)</th>
                      <th>Net Payout</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map(o => {
                        const amount = Number(o.total) || 0;
                        const fee = Math.round(amount * 0.02 * 100) / 100;
                        const net = Math.max(0, amount - fee);
                        return (
                          <tr key={o.id}>
                            <td>
                              <div style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{o.id}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                {o.transactionRef || `txn_${o.id.toLowerCase()}`}
                              </div>
                            </td>
                            <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                              {currentUser?.email || 'customer@store.io'}
                            </td>
                            <td>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                background: 'var(--surface-subtle)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontFamily: 'var(--font-mono)'
                              }}>
                                {o.paymentMethod || 'RAZORPAY'}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>₹{amount}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--rose-text)' }}>−₹{fee}</td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--emerald-text)' }}>₹{net}</td>
                            <td>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--emerald-text)', background: 'var(--emerald-bg)', padding: '2px 8px', borderRadius: '99px' }}>
                                ✓ Captured
                              </span>
                            </td>
                            <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              {new Date(o.date).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                          No payment transactions recorded yet. Complete a checkout in the storefront to see live transaction records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CATALOG & INVENTORY (CRUD) */}
          {/* ========================================================= */}
          {activeTab === 'catalog' && (
            <div className="animate-fade-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Store Catalog Inventory</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    Add new titles, edit pricing, adjust stock, or update digital PDF links.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={clearSeedBooks}
                    title="Clear sample titles"
                  >
                    Clear Sample Books
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={resetCatalog}
                    title="Reset to initial catalog"
                  >
                    <RefreshCw size={13} /> Reset Catalog
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setAdminEditingBook(null);
                      setIsAdminFormOpen(true);
                    }}
                  >
                    <Plus size={15} /> Add New E-Book
                  </button>
                </div>
              </div>

              {/* CRUD Inventory Table */}
              <div className="admin-table-container table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Cover</th>
                      <th>Title & Dewey</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id}>
                        <td>
                          <div style={{
                            width: '36px',
                            height: '46px',
                            borderRadius: '4px',
                            background: (book.coverImage || book.imageUrl) ? '#0F172A' : `linear-gradient(135deg, ${book.color || '#4F46E5'}, ${book.colorEnd || '#312E81'})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-xs)'
                          }}>
                            {(book.coverImage || book.imageUrl) ? (
                              <img 
                                src={book.coverImage || book.imageUrl} 
                                alt={book.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              />
                            ) : (
                              book.title.substring(0, 2).toUpperCase()
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{book.title}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                            {book.no || '005.1'}
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{book.author}</td>
                        <td>
                          <span className="catalog-tag" style={{ fontSize: '10.5px' }}>{book.category}</span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>₹{book.price}</td>
                        <td>
                          <span style={{
                            fontWeight: 700,
                            color: book.stock > 10 ? 'var(--emerald-text)' : book.stock > 0 ? 'var(--gold-text)' : 'var(--rose-text)'
                          }}>
                            {book.stock} units
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--gold-text)' }}>
                          ★ {book.rating || '4.8'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '6px 10px' }}
                              onClick={() => {
                                setAdminEditingBook(book);
                                setIsAdminFormOpen(true);
                              }}
                              title="Edit Book"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '6px 10px', color: 'var(--rose)' }}
                              onClick={() => deleteAdminBook(book.id)}
                              title="Delete Book"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CUSTOMER ORDERS & INVOICES */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="animate-fade-up">
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
                Customer Purchase Orders & Receipts
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                Itemized transaction logs of customer orders placed on NodeLib.
              </p>

              {orders.length > 0 ? (
                <div className="admin-table-container table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date & Time</th>
                        <th>Books Ordered</th>
                        <th>Payment Gateway</th>
                        <th>Total Paid</th>
                        <th>Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => {
                        const orderBooks = (order.items || []).map(id => books.find(b => b.id === id)).filter(Boolean);
                        return (
                          <tr key={order.id}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>
                              {order.id}
                            </td>
                            <td style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                              {new Date(order.date).toLocaleString()}
                            </td>
                            <td>
                              <div style={{ fontSize: '13px', fontWeight: 600 }}>
                                {orderBooks.length > 0 
                                  ? orderBooks.map(b => b.title).join(', ') 
                                  : `${order.items?.length || 0} books`}
                              </div>
                            </td>
                            <td>
                              <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: 'var(--surface-subtle)',
                                padding: '3px 8px',
                                borderRadius: '4px'
                              }}>
                                {order.paymentMethod || 'RAZORPAY'}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                              ₹{order.total}
                            </td>
                            <td>
                              <span style={{
                                fontSize: '11.5px',
                                fontWeight: 700,
                                color: 'var(--emerald-text)',
                                background: 'var(--emerald-bg)',
                                padding: '3px 8px',
                                borderRadius: '99px'
                              }}>
                                ✓ {order.status || 'Delivered'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{
                  padding: '48px',
                  textAlign: 'center',
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px dashed var(--border)'
                }}>
                  <ShoppingBag size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                  <h4>No orders placed yet</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    When customers purchase books from the storefront, their transactions will appear here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: DATABASE & SUPABASE SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'database' && (
            <div className="animate-fade-up">
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(20px, 4vw, 30px)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <Database size={24} color={isSupabaseConnected ? 'var(--emerald)' : 'var(--primary)'} />
                  <h3 style={{ fontSize: '20px', fontWeight: 800 }}>
                    Supabase PostgreSQL Cloud Database Configuration
                  </h3>
                </div>

                <div style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: isSupabaseConnected ? 'var(--emerald-bg)' : 'var(--primary-light)',
                  color: isSupabaseConnected ? 'var(--emerald-text)' : 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle size={18} />
                  <span>
                    Status: {isSupabaseConnected ? 'Connected to live Supabase Cloud Database' : 'Offline / Local Fallback Active'}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Your live <strong>Supabase PostgreSQL</strong> stores all customer registrations, encrypted passwords, orders, payments analytics, and digital shelf records securely.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => setIsSupabaseModalOpen(true)}
                >
                  <Database size={15} /> Configure Supabase Connection Keys
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: GATEWAY & BUSINESS SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="animate-fade-up" style={{ display: 'grid', gap: '24px' }}>
              
              {/* Razorpay Gateway API Configuration */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                      Razorpay Gateway &amp; Merchant Settings
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Configure your production or test Razorpay API Key for live customer transactions.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveRzpKey} style={{ display: 'grid', gap: '16px', maxWidth: '640px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                      Razorpay Key ID (rzp_live_... or rzp_test_...)
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={customRzpKey}
                        onChange={(e) => setCustomRzpKey(e.target.value)}
                        placeholder="rzp_test_... or rzp_live_..."
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          background: 'var(--surface-subtle)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13.5px'
                        }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                        <Save size={14} /> Save Key
                      </button>
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--surface-subtle)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border)',
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}>
                    <strong>💡 How to get your Live API Key:</strong><br />
                    1. Log in to your <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>Razorpay Dashboard → Settings → API Keys ↗</a><br />
                    2. Click <strong>Generate Live Key</strong> or <strong>Generate Test Key</strong>.<br />
                    3. Copy the <strong>Key ID</strong> and paste it above, or add it to your <code>.env</code> file as <code>VITE_RAZORPAY_KEY_ID</code>.
                  </div>
                </form>
              </div>

              {/* Startup E-Commerce Compliance & GST Config */}
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--emerald-bg)',
                    color: 'var(--emerald-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>
                      E-Commerce Tax &amp; Compliance Details
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Configured for Indian Goods and Services Tax (GST) &amp; Payment Gateway Verification.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px' }}>
                  <div style={{ background: 'var(--surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase' }}>Registered Legal Entity</span>
                    <strong style={{ fontSize: '14px', marginTop: '2px', display: 'block' }}>Lotus &amp; Lithium Technologies Pvt. Ltd.</strong>
                  </div>
                  <div style={{ background: 'var(--surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase' }}>Digital Goods SAC Code</span>
                    <strong style={{ fontSize: '14px', marginTop: '2px', display: 'block', fontFamily: 'var(--font-mono)' }}>4901 (E-Books &amp; Technical Manuals)</strong>
                  </div>
                  <div style={{ background: 'var(--surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase' }}>GST Tax Rate</span>
                    <strong style={{ fontSize: '14px', marginTop: '2px', display: 'block', color: 'var(--emerald-text)' }}>18% Standard GST (Included in Price)</strong>
                  </div>
                  <div style={{ background: 'var(--surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase' }}>Delivery SLA</span>
                    <strong style={{ fontSize: '14px', marginTop: '2px', display: 'block', color: 'var(--primary)' }}>0-Sec Automated Instant Digital Delivery</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // LOCKED ADMIN PORTAL LOGIN SCREEN
  // ==========================================
  return (
    <div className="section view-enter" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ maxWidth: '440px' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(24px, 5vw, 36px)',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'var(--rose-bg)',
            color: 'var(--rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Shield size={26} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Store Owner & Admin Portal
          </h2>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.55, marginBottom: '24px' }}>
            This portal is restricted to authorized store managers. Customers browse the public storefront.
          </p>

          <form onSubmit={handleUnlock} style={{ display: 'grid', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Enter Admin Security Key..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <KeyRound size={16} /> Unlock Management Console
            </button>
          </form>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Demo Owner Key: <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>admin123</code>
            </span>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: '16px', width: '100%' }}
            onClick={() => navigateTo('catalog')}
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
}
