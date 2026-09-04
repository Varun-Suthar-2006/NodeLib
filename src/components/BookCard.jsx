import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Star, BookOpen, Check, ShoppingBag, Layers, Sparkles } from 'lucide-react';

export default function BookCard({ book, index = 0 }) {
  const { 
    library, cart, addToCart, 
    isWishlisted, toggleWishlist, 
    openReader, navigateTo 
  } = useApp();

  const isOwned = library.includes(book.id);
  const inCart = cart.includes(book.id);
  const wished = isWishlisted(book.id);
  const isOutOfStock = book.stock <= 0 && !isOwned;

  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    
    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  const getInitials = (title) => {
    return title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleCardClick = () => {
    navigateTo('product', book.id);
  };

  const staggerClass = `stagger-${Math.min(9, (index % 9) + 1)}`;

  return (
    <div 
      ref={cardRef}
      className={`book-card animate-fade-up ${staggerClass}`}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: rotate.x || rotate.y 
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-8px)` 
          : undefined
      }}
    >
      {/* Dynamic Specular Glare Reflection */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--radius-lg)',
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 8,
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Badges */}
      <div className="card-badges">
        {book.featured && <span className="badge-pill featured">Featured</span>}
        {book.bestSeller && <span className="badge-pill bestseller">Bestseller</span>}
      </div>

      {/* Wishlist Heart Button */}
      <button 
        className={`wish-heart-btn ${wished ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(book.id);
        }}
        title={wished ? 'Remove from wishlist' : 'Save to wishlist'}
        aria-label="Toggle Wishlist"
      >
        <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
      </button>

      {/* Book Cover Design */}
      <div 
        className="book-cover"
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
              className="book-cover-img"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1,
                transition: 'transform 0.4s ease'
              }}
            />
            {/* Gradient Overlay for Text Legibility */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.2) 45%, rgba(15,23,42,0.7) 100%)',
                zIndex: 2
              }}
            />
          </>
        )}

        <div className="book-cover-no" style={{ position: 'relative', zIndex: 3 }}>
          NO. {book.no || '005.1 NLB'}
        </div>
        <div className="book-cover-body" style={{ position: 'relative', zIndex: 3 }}>
          {!(book.coverImage || book.imageUrl) && (
            <div className="book-cover-initials">{getInitials(book.title)}</div>
          )}
          <div className="book-cover-sub" style={{ textShadow: (book.coverImage || book.imageUrl) ? '0 2px 8px rgba(0,0,0,0.8)' : undefined }}>
            {book.category || 'Technology'}
          </div>
        </div>
        <div className="book-cover-foot" style={{ position: 'relative', zIndex: 3 }}>
          <span>NODELIB</span>
          <span>DIGITAL ED.</span>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="book-meta-top">
        <span className="catalog-tag">NO. {book.no || '005.1'}</span>
        <div className="stock-pill">
          {book.stock > 10 ? (
            <span className="stock-in">● In Stock ({book.stock})</span>
          ) : book.stock > 0 ? (
            <span className="stock-low">▲ Low Stock ({book.stock})</span>
          ) : (
            <span className="stock-out">✕ Out of Stock</span>
          )}
        </div>
      </div>

      {/* Title & Author */}
      <h3 className="book-card-title">{book.title}</h3>
      <div className="book-card-author">by {book.author}</div>

      {/* Rating */}
      <div className="rating-line">
        <Star size={14} fill="#F59E0B" color="#F59E0B" />
        <span>{book.rating || '4.8'}</span>
        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
          ({book.reviewCount || 24} reviews)
        </span>
      </div>

      {/* Short Description */}
      <p className="book-card-desc">{book.desc}</p>

      {/* Book Edition & Technical Specs Strip */}
      <div className="book-card-specs">
        <span className="spec-pill">
          <Layers size={11} /> {book.category || 'Engineering'}
        </span>
        <span className="spec-pill">
          <Sparkles size={11} /> DRM-Free Digital
        </span>
      </div>

      {/* Footer: Price & Primary Action */}
      <div className="book-card-foot" onClick={(e) => e.stopPropagation()}>
        <div>
          <span className="price-tag">₹{book.price}</span>
          {book.originalPrice && (
            <span className="price-strike">₹{book.originalPrice}</span>
          )}
        </div>

        {isOwned ? (
          <button 
            className="btn btn-primary btn-sm book-action-btn"
            style={{ background: 'var(--emerald)', boxShadow: 'none' }}
            onClick={() => openReader(book.id)}
          >
            <BookOpen size={13} />
            <span className="card-btn-label-desktop">Read now ✓</span>
            <span className="card-btn-label-mobile">Read</span>
          </button>
        ) : isOutOfStock ? (
          <button className="btn btn-ghost btn-sm book-action-btn" disabled>
            <span className="card-btn-label-desktop">Out of stock</span>
            <span className="card-btn-label-mobile">Sold Out</span>
          </button>
        ) : inCart ? (
          <button 
            className="btn btn-ghost btn-sm book-action-btn"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            onClick={() => addToCart(book.id)}
          >
            <Check size={13} />
            <span className="card-btn-label-desktop">In Cart</span>
            <span className="card-btn-label-mobile">Added</span>
          </button>
        ) : (
          <button 
            className="btn btn-primary btn-sm book-action-btn"
            onClick={() => addToCart(book.id)}
          >
            <ShoppingBag size={13} />
            <span className="card-btn-label-desktop">Add to Cart</span>
            <span className="card-btn-label-mobile">Add</span>
          </button>
        )}
      </div>
    </div>
  );
}
