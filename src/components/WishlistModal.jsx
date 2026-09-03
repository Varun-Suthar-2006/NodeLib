import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistModal() {
  const { 
    isWishlistOpen, setIsWishlistOpen, 
    wishlist, toggleWishlist, 
    books, addToCart, navigateTo 
  } = useApp();

  if (!isWishlistOpen) return null;

  const wishedBooks = wishlist.map(id => books.find(b => b.id === id)).filter(Boolean);

  return (
    <div className="modal-overlay" onClick={() => setIsWishlistOpen(false)}>
      <div 
        className="modal-content wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="var(--rose)" fill="var(--rose)" />
            <h3 style={{ margin: 0 }}>My Wishlist ({wishedBooks.length})</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsWishlistOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {wishedBooks.length > 0 ? (
          <div className="reco-grid">
            {wishedBooks.map(book => (
              <div 
                key={book.id}
                className="mini-card"
                onClick={() => {
                  setIsWishlistOpen(false);
                  navigateTo('product', book.id);
                }}
              >
                <div 
                  className="mini-cover"
                  style={{
                    background: `linear-gradient(135deg, ${book.color || '#4F46E5'} 0%, ${book.colorEnd || '#312E81'} 100%)`
                  }}
                >
                  {book.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 800 }}>{book.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>by {book.author}</p>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, marginTop: 'auto', paddingTop: '8px' }}>
                  ₹{book.price}
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => addToCart(book.id)}
                  >
                    <ShoppingBag size={13} /> Add
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--rose)' }}
                    onClick={() => toggleWishlist(book.id)}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <Heart size={44} style={{ opacity: 0.3, margin: '0 auto 14px', color: 'var(--rose)' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Your wishlist is empty
            </h4>
            <p style={{ fontSize: '13.5px', maxWidth: '380px', margin: '0 auto 20px' }}>
              Bookmark titles by clicking the heart icon on any book card to save them for later.
            </p>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsWishlistOpen(false);
                navigateTo('catalog');
              }}
            >
              Browse Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
