import React from 'react';
import { useApp } from '../context/AppContext';
import BookCard from './BookCard';
import { Sparkles, ArrowRight, Compass, Search, RefreshCw } from 'lucide-react';

export default function CatalogView() {
  const { 
    books, allTags, activeFilter, setActiveFilter, 
    searchQuery, setSearchQuery, 
    getScoredRecommendations, 
    setIsFinderOpen, navigateTo 
  } = useApp();

  const recommendations = getScoredRecommendations(4);

  // Filter books by activeFilter and searchQuery
  const filteredBooks = books.filter(b => {
    const matchesFilter = activeFilter === 'all' || (b.tags && b.tags.includes(activeFilter)) || b.category === activeFilter;
    if (!matchesFilter) return false;
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
          <div style={{ marginBottom: '56px' }} className="animate-fade-up stagger-1">
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

        {/* Full Store Catalog Section */}
        <div className="section-head animate-fade-up stagger-2">
          <div>
            <div className="section-kicker">DIGITAL BOOKSTORE</div>
            <h2 className="section-title">
              {searchQuery ? `Search results for "${searchQuery}"` : 'The Full Catalog'}
            </h2>
          </div>

          {/* Filter Chips Bar */}
          <div className="filter-bar">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`filter-chip ${activeFilter === tag ? 'active' : ''}`}
                onClick={() => setActiveFilter(tag)}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredBooks.length > 0 ? (
          <div className="catalog-grid">
            {filteredBooks.map((book, idx) => (
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
              We couldn't find any books matching your search or active filter. Try clearing your filters or search terms.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
            >
              <RefreshCw size={15} /> Clear All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
