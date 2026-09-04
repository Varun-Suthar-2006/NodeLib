import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import InvoiceModal from './InvoiceModal';
import { 
  Receipt, CheckCircle, Package, ArrowRight, 
  BookOpen, FileText, Printer, ShieldCheck 
} from 'lucide-react';

export default function OrdersView() {
  const { orders, books, currentUser, setIsAuthOpen, openReader, navigateTo } = useApp();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  if (!currentUser) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{
          maxWidth: '460px',
          margin: '0 auto',
          background: 'var(--surface)',
          padding: '40px 30px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)'
        }}>
          <Receipt size={48} style={{ color: 'var(--primary)', opacity: 0.5, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Sign in to view orders</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Your completed e-book purchases, downloadable invoices, and library activations are linked to your account.
          </p>
          <button className="btn btn-primary" onClick={() => setIsAuthOpen(true)}>
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrap view-enter" style={{ padding: '40px 0 70px' }}>
        <div className="section-head">
          <div>
            <div className="section-kicker">PURCHASE HISTORY &amp; GST INVOICES</div>
            <h2 className="section-title">My Orders ({orders.length})</h2>
          </div>
        </div>

        {orders.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {orders.map(order => {
              const orderBooks = (order.items || []).map(id => {
                if (typeof id === 'object') return id;
                return books.find(b => b.id === id);
              }).filter(Boolean);

              const dateStr = new Date(order.date || Date.now()).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={order.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontSize: '16px', fontFamily: 'var(--font-mono)' }}>
                          Order #{order.id}
                        </strong>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          background: 'var(--emerald-bg)',
                          color: 'var(--emerald-text)',
                          padding: '3px 8px',
                          borderRadius: '99px'
                        }}>
                          ✓ {order.status || 'Delivered'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Placed on {dateStr} · Paid via {order.paymentMethod || 'RAZORPAY'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)' }}>
                        ₹{order.total}
                      </div>

                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedInvoiceOrder(order)}
                        style={{ gap: '6px' }}
                      >
                        <FileText size={14} /> Tax Invoice
                      </button>
                    </div>
                  </div>

                  {/* Items in this Order */}
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {orderBooks.map((book, idx) => (
                      <div 
                        key={book.id || idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '14px',
                          padding: '10px 14px',
                          background: 'var(--surface-subtle)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: book.color || 'var(--primary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '11px'
                          }}>
                            {book.title.split(' ').map(w => w[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{book.title}</strong>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              by {book.author || 'NodeLib Author'} · DRM-Free E-Book
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <strong style={{ fontFamily: 'var(--font-mono)' }}>₹{book.price}</strong>
                          <button 
                            className="btn btn-primary btn-sm"
                            style={{ background: 'var(--emerald)' }}
                            onClick={() => openReader(book.id)}
                          >
                            <BookOpen size={13} /> Read
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: 'var(--surface)',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <Package size={48} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
              Your purchase receipts and invoice histories will automatically appear here once you complete a purchase.
            </p>
            <button className="btn btn-primary" onClick={() => navigateTo('catalog')}>
              Explore Books &amp; Start Reading <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          books={books}
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </>
  );
}
