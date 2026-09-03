import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { 
    isCartOpen, setIsCartOpen, 
    cart, removeFromCart, 
    books, startCheckout, navigateTo 
  } = useApp();

  if (!isCartOpen) return null;

  const cartBooks = cart.map(id => books.find(b => b.id === id)).filter(Boolean);
  const total = cartBooks.reduce((sum, b) => sum + b.price, 0);

  return (
    <>
      <div 
        className="cart-drawer-backdrop" 
        onClick={() => setIsCartOpen(false)}
      />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Your Cart ({cart.length})</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="cart-drawer-body">
          {cartBooks.length > 0 ? (
            cartBooks.map(book => (
              <div key={book.id} className="cart-item-row">
                <div 
                  className="cart-item-cover"
                  style={{
                    background: `linear-gradient(135deg, ${book.color || '#4F46E5'} 0%, ${book.colorEnd || '#312E81'} 100%)`
                  }}
                >
                  {book.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, lineHeight: 1.25, color: 'var(--text-primary)' }}>
                    {book.title}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    by {book.author}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                    ₹{book.price}
                  </div>
                </div>

                <button 
                  className="btn-icon" 
                  style={{ width: '32px', height: '32px', color: 'var(--rose)' }}
                  onClick={() => removeFromCart(book.id)}
                  title="Remove from cart"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Your cart is empty
              </h4>
              <p style={{ fontSize: '13.5px', marginBottom: '20px' }}>
                Explore our catalog to add books to your library cart.
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('catalog');
                }}
              >
                Discover Books
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartBooks.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span>Total Amount:</span>
              <span>₹{total}</span>
            </div>
            <button 
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => startCheckout(cart)}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
