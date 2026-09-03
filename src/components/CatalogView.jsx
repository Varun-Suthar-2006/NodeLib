import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import BookCard from './BookCard';
import { 
  Sparkles, ArrowRight, Compass, Search, RefreshCw, 
  Layers, SlidersHorizontal, ArrowUpDown, Check, 
  Cpu, Database, ShieldCheck, Flame, BookMarked
} from 'lucide-react';

export default function CatalogView() {
  const { 
    books, activeFilter, setActiveFilter, 
    searchQuery, setSearchQuery, 
    getScoredRecommendations, 
    setIsFinderOpen, navigateTo 
  } = useApp();

  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const recommendations = getScoredRecommendations(4);

  // Extract distinct engineering categories with counts
  const categories = useMemo(() => {
    const counts = {};
    books.forEach(b => {
      const cat = b.category || 'General Engineering';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const categoryList = [
      { id: 'all', label: 'All Disciplines', count: books.length, icon: Layers },
      ...Object.keys(counts).map(cat => ({
        id: cat,
        label: cat,
        count: counts[cat],
        icon: cat.includes('Systems') ? Cpu : cat.includes('Database') ? Database : cat.includes('Security') ? ShieldCheck : BookMarked
      }))
    ];
    return categoryList;
  }, [books]);

  // Filter and Sort Books
  const processedBooks = useMemo(() => {
    let result = books.filter(b => {
      // Category / Filter matching
      const matchesFilter = activeFilter === 'all' || b.category === activeFilter || (b.tags && b.tags.includes(activeFilter));
      if (!matchesFilter) return false;

      // Stock filter
      if (onlyInStock && (b.stock || 0) <= 0) return false;

      // Search matching
      if (!searchQuery || !searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const hay = [
        b.title, 
        b.author, 
        b.desc, 
        b.fullDesc || '', 
        b.category || '',
        ...(b.tags || [])
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'bestseller') {
        return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      }
      // default: featured
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [books, activeFilter, onlyInStock, searchQuery, sortBy]);

  return (
    <section className="section view-enter" id="catalog-section">
      <div className="wrap">
        
        {/* Smart Discovery Feature Banner */}
        <div className="feature-banner animate-fade-up" style={{ marginBottom: '36px' }}>
          <div>
            <div className="section-kicker" style={{ color: '#93C5FD' }}>
              <Sparkles size={14} /> SMART DISCOVERY
            </div>
            <h3>Not sure what to read next?</h3>
            <p>
              Tell NodeLib your learning goal, experience level, and budget. Our smart finder shortlists high-impact titles in seconds instead of making you browse endlessly.
            </p>
          </div>
          <button 
            className="btn btn-primary"
            style={{ background: '#FFFFFF', color: '#1D4ED8', flexShrink: 0 }}
            onClick={() => setIsFinderOpen(true)}
          >
            Find My Book <ArrowRight size={16} />
          </button>
        </div>

        {/* Recommended Picks Section */}
        {recommendations.length > 0 && !searchQuery && (
          <div style={{ marginBottom: '52px' }} className="animate-fade-up stagger-1">
            <div className="section-head">
              <div>
                <div className="section-kicker">CURATED FOR YOU</div>
                <h2 className="section-title">Recommended Picks</h2>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => navigateTo('insights')}
              >
                View My Insights →
              </button>
            </div>

            <div className="reco-grid">
              {recommendations.map((book, idx) => (
                <div 
                  key={book.id} 
                  className={`mini-card animate-fade-up stagger-${idx + 1}`}
                  onClick={() => navigateTo('product', book.id)}
                >
                  <div 
                    className="mini-cover"
                    style={{
                      background: `linear-gradient(135deg, ${book.color || '#4F46E5'} 0%, ${book.colorEnd || '#312E81'} 100%)`
                    }}
                  >
                    {book.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.25 }}>
                    {book.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    by {book.author}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '8px'
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-text)' }}>
                      ★ {book.rating || '4.9'}
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
                      ₹{book.price}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Store Catalog Section Header */}
        <div className="catalog-header-wrap animate-fade-up stagger-2" style={{ marginBottom: '24px' }}>
          <div className="section-head" style={{ marginBottom: '18px' }}>
            <div>
              <div className="section-kicker">DIGITAL BOOKSTORE</div>
              <h2 className="section-title">
                {searchQuery ? `Search results for "${searchQuery}"` : 'The Full Catalog'}
              </h2>
            </div>

            {/* Live Count Pill */}
            <div className="catalog-count-badge">
              <span>{processedBooks.length} titles available</span>
            </div>
          </div>

          {/* Curated Discipline / Category Filter Tabs */}
          <div className="category-tabs-bar">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat.id)}
                >
                  <Icon size={14} className="cat-icon" />
                  <span>{cat.label}</span>
                  <span className="cat-counter">{cat.count}</span>
                </button>
              );
            })}
          </div>

          {/* Controls Bar: Sort & Quick Toggles */}
          <div className="catalog-controls-bar">
            <div className="controls-left">
              <span className="controls-label">
                <SlidersHorizontal size={14} /> Refine:
              </span>
              <button
                className={`control-pill-btn ${onlyInStock ? 'active' : ''}`}
                onClick={() => setOnlyInStock(prev => !prev)}
              >
                {onlyInStock ? <Check size={13} /> : null} In Stock Only
              </button>
            </div>

            <div className="controls-right">
              <span className="controls-label">
                <ArrowUpDown size={14} /> Sort:
              </span>
              <select 
                className="sort-select-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort Catalog"
              >
                <option value="featured">✨ Featured Releases</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="bestseller">🔥 Best Sellers First</option>
                <option value="price-asc">💵 Price: Low to High</option>
                <option value="price-desc">💎 Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        {processedBooks.length > 0 ? (
          <div className="catalog-grid">
            {processedBooks.map((book, idx) => (
              <BookCard key={book.id} book={book} index={idx} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: 'var(--surface)',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-xl)'
          }} className="animate-fade-up">
            <Search size={44} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
              No matching books found
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px' }}>
              We couldn't find any books matching your active filters or search terms.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
                setOnlyInStock(false);
                setSortBy('featured');
              }}
            >
              <RefreshCw size={15} /> Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
