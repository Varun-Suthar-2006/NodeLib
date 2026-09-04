import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Star, Heart, BookOpen, ShoppingBag, 
  CheckCircle2, Shield, Smartphone, Infinity, ArrowRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const { 
    selectedBookId, books, library, cart, addToCart, 
    toggleWishlist, isWishlisted, 
    startCheckout, openReader, navigateTo 
  } = useApp();

  const book = books.find(b => b.id === selectedBookId) || books[0];
  if (!book) return null;

  const isOwned = library.includes(book.id);
  const inCart = cart.includes(book.id);
  const wished = isWishlisted(book.id);
  const isOutOfStock = book.stock <= 0 && !isOwned;

  const getInitials = (title) => {
    return title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const relatedBooks = books
    .filter(b => b.id !== book.id && (b.category === book.category || (b.tags && b.tags.some(t => book.tags.includes(t)))))
    .slice(0, 3);

  return (
    <div className="product-detail-view wrap">
      {/* Back Button */}
      <button 
        className="btn btn-ghost btn-sm"
        onClick={() => navigateTo('catalog')}
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      {/* Main Grid */}
      <div className="product-detail-grid">
        {/* Visual Cover Column */}
        <div className="product-detail-visual">
          <div 
            className="detail-large-cover"
            style={{
              background: (book.coverImage || book.imageUrl)
                ? '#0F172A'
                : `linear-gradient(145deg, ${book.color || '#4F46E5'} 0%, ${book.colorEnd || '#312E81'} 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {(book.coverImage || book.imageUrl) && (
              <>
                <img 
                  src={book.coverImage || book.imageUrl} 
                  alt={book.title} 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
                  }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.2) 50%, rgba(15,23,42,0.75) 100%)',
                    zIndex: 2
                  }}
                />
              </>
            )}

            <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 800 }}>
                NO. {book.no || '005.1 NLB'}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '99px' }}>
                DIGITAL EDITION
              </span>
            </div>

            <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', margin: '40px 0' }}>
              {!(book.coverImage || book.imageUrl) && (
                <div className="initials">{getInitials(book.title)}</div>
              )}
              <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', marginTop: '10px', textTransform: 'uppercase', textShadow: (book.coverImage || book.imageUrl) ? '0 2px 10px rgba(0,0,0,0.8)' : undefined }}>
                {book.category || 'Software Engineering'}
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              <span>NODELIB PRESS</span>
              <span>VERIFIED MASTER</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px', gap: '8px' }}>
            <span className="tag-pill" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Catalog No: {book.no || '005.1'}
            </span>
            <span className="tag-pill" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Format: DRM-Free PDF / Web
            </span>
          </div>
        </div>

        {/* Content Column */}
        <div className="product-detail-info">
          <div className="section-kicker">PRODUCT DETAILS & SYNOPSIS</div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {book.featured && <span className="badge-pill featured">Featured</span>}
            {book.bestSeller && <span className="badge-pill bestseller">Bestseller</span>}
          </div>

          <h1>{book.title}</h1>
          <div className="detail-author-line">by {book.author.toUpperCase()}</div>

          <div className="rating-line" style={{ fontSize: '14px', marginBottom: '14px' }}>
            <Star size={16} fill="#F59E0B" color="#F59E0B" />
            <strong style={{ color: 'var(--text-primary)' }}>{book.rating || '4.9'}</strong>
            <span style={{ color: 'var(--text-muted)' }}>
              ({book.reviewCount || 38} verified reader reviews)
            </span>
          </div>

          <div className="tags-list" style={{ marginBottom: '18px' }}>
            {book.tags && book.tags.map(tag => (
              <span key={tag} className="tag-pill" style={{ fontSize: '12px', padding: '4px 10px' }}>
                #{tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <span className="tag-pill" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>
              📚 {book.category || 'General Engineering'}
            </span>
            {book.stock > 10 ? (
              <span className="stock-pill stock-in">✓ In Stock ({book.stock} copies)</span>
            ) : book.stock > 0 ? (
              <span className="stock-pill stock-low">⚠ Low Stock ({book.stock} left)</span>
            ) : (
              <span className="stock-pill stock-out">✕ Out of Stock</span>
            )}
          </div>

          <p className="detail-desc-text">
            {book.fullDesc || book.desc}
          </p>

          <div className="detail-price-box">
            <span>₹{book.price}</span>
            {book.originalPrice && (
              <span className="price-strike" style={{ fontSize: '20px' }}>
                ₹{book.originalPrice}
              </span>
            )}
            <span style={{ fontSize: '13px', color: 'var(--emerald-text)', fontWeight: 700, marginLeft: 'auto' }}>
              ✓ Instant Digital Delivery
            </span>
          </div>

          {/* Action Buttons */}
          <div className="detail-actions-row">
            {isOwned ? (
              <button 
                className="btn btn-primary btn-lg"
                style={{ background: 'var(--emerald)' }}
                onClick={() => openReader(book.id)}
              >
                <BookOpen size={18} /> Read in Library Now →
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-primary btn-lg"
                  disabled={isOutOfStock}
                  onClick={() => startCheckout([book.id])}
                >
                  <ShoppingBag size={18} /> Buy Now (₹{book.price}) →
                </button>
                <button 
                  className="btn btn-ghost btn-lg"
                  disabled={isOutOfStock}
                  onClick={() => addToCart(book.id)}
                >
                  {inCart ? 'Already in Cart ✓' : '+ Add to Cart'}
                </button>
              </>
            )}

            <button 
              className={`btn btn-ghost btn-lg ${wished ? 'active' : ''}`}
              style={{ color: wished ? 'var(--rose)' : undefined }}
              onClick={() => toggleWishlist(book.id)}
            >
              <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
              {wished ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>

          {/* Value Props Grid */}
          <div className="feature-grid">
            <div className="feature-box">
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="var(--emerald)" /> Instant Access
              </strong>
              <span>Unlock full PDF & web reader immediately in your personal library.</span>
            </div>
            <div className="feature-box">
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} color="var(--primary)" /> Secure Checkout
              </strong>
              <span>Encrypted payment processing via Razorpay, UPI & Cards.</span>
            </div>
            <div className="feature-box">
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={16} color="var(--accent)" /> Responsive E-Reader
              </strong>
              <span>Distraction-free reading optimized for mobile, tablet & desktop.</span>
            </div>
            <div className="feature-box">
              <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Infinity size={16} color="var(--gold-text)" /> Lifetime Access
              </strong>
              <span>Your purchased titles remain perpetually synced to your account.</span>
            </div>
          </div>

          {/* Sample Chapters Section */}
          {book.sampleChapters && book.sampleChapters.length > 0 && (
            <div style={{ marginTop: '36px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>
                📖 Sample Chapter Preview
              </h3>
              <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                  {book.sampleChapters[0].title}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {book.sampleChapters[0].content}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div style={{ marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
          <div className="section-head">
            <div>
              <div className="section-kicker">SIMILAR TITLES</div>
              <h3 className="section-title">You Might Also Like</h3>
            </div>
          </div>
          <div className="reco-grid">
            {relatedBooks.map(rb => (
              <div 
                key={rb.id}
                className="mini-card"
                onClick={() => navigateTo('product', rb.id)}
              >
                <div 
                  className="mini-cover"
                  style={{
                    background: `linear-gradient(135deg, ${rb.color || '#4F46E5'} 0%, ${rb.colorEnd || '#312E81'} 100%)`
                  }}
                >
                  {getInitials(rb.title)}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{rb.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>by {rb.author}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-text)' }}>
                    ★ {rb.rating}
                  </span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>₹{rb.price}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
