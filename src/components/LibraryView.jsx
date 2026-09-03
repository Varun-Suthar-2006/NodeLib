import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Search, Sparkles, ExternalLink, Bookmark } from 'lucide-react';

export default function LibraryView() {
  const { library, books, openReader, navigateTo } = useApp();
  const [libSearch, setLibSearch] = useState('');

  const ownedBooks = library.map(id => books.find(b => b.id === id)).filter(Boolean);

  const filteredOwned = ownedBooks.filter(b => {
    if (!libSearch.trim()) return true;
    const q = libSearch.toLowerCase().trim();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.tags && b.tags.some(t => t.toLowerCase().includes(q)));
  });

  return (
    <div className="wrap" style={{ padding: '40px 0 60px' }}>
      <div className="section-head">
        <div>
          <div className="section-kicker">PERSONAL DIGITAL SHELF</div>
          <h2 className="section-title">My Library ({ownedBooks.length})</h2>
        </div>

        {ownedBooks.length > 0 && (
          <div className="smart-search" style={{ width: '280px' }}>
            <Search size={15} className="smart-search-icon" />
            <input 
              type="search"
              placeholder="Search your library..."
              value={libSearch}
              onChange={(e) => setLibSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {ownedBooks.length > 0 ? (
        filteredOwned.length > 0 ? (
          <div className="catalog-grid">
            {filteredOwned.map(book => (
              <div key={book.id} className="book-card" style={{ cursor: 'default' }}>
                <div 
                  className="book-cover"
                  style={{
                    background: `linear-gradient(145deg, ${book.color || '#4F46E5'} 0%, ${book.colorEnd || '#312E81'} 100%)`,
                    cursor: 'pointer'
                  }}
                  onClick={() => openReader(book.id)}
                >
                  <div className="book-cover-no">NO. {book.no || '005.1'}</div>
                  <div className="book-cover-body">
                    <div className="book-cover-initials">
                      {book.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div className="book-cover-sub">{book.category}</div>
                  </div>
                  <div className="book-cover-foot">
                    <span>OWNED & VERIFIED</span>
                    <span>DRM-FREE</span>
                  </div>
                </div>

                <h3 
                  className="book-card-title"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigateTo('product', book.id)}
                >
                  {book.title}
                </h3>
                <div className="book-card-author">by {book.author}</div>
                <p className="book-card-desc">{book.desc}</p>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, background: 'var(--emerald)' }}
                    onClick={() => openReader(book.id)}
                  >
                    <BookOpen size={15} /> Read Now →
                  </button>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigateTo('product', book.id)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No books match your search "{libSearch}".</p>
          </div>
        )
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'var(--surface)',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <Bookmark size={48} style={{ color: 'var(--primary)', opacity: 0.4, margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
            Your digital library is empty
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            When you purchase e-books or choose student reading bundles, your lifetime DRM-free titles will appear here ready for reading.
          </p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => navigateTo('catalog')}
          >
            <Sparkles size={16} /> Explore Catalog & Unlock Books
          </button>
        </div>
      )}
    </div>
  );
}
