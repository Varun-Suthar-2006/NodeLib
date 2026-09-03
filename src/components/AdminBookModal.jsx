import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';

const COLOR_SWATCHES = [
  '#4F46E5', '#0284C7', '#059669', '#7C3AED', 
  '#D97706', '#DB2777', '#EA580C', '#0D9488', '#9333EA'
];

export default function AdminBookModal() {
  const { 
    isAdminFormOpen, setIsAdminFormOpen, 
    adminEditingBook, saveAdminBook, showToast 
  } = useApp();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [no, setNo] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('25');
  const [tags, setTags] = useState('');
  const [desc, setDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [color, setColor] = useState(COLOR_SWATCHES[0]);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (adminEditingBook) {
      setTitle(adminEditingBook.title || '');
      setAuthor(adminEditingBook.author || '');
      setPrice(String(adminEditingBook.price || ''));
      setNo(adminEditingBook.no || '');
      setCategory(adminEditingBook.category || '');
      setStock(String(adminEditingBook.stock ?? 25));
      setTags((adminEditingBook.tags || []).join(', '));
      setDesc(adminEditingBook.desc || '');
      setFullDesc(adminEditingBook.fullDesc || '');
      setColor(adminEditingBook.color || COLOR_SWATCHES[0]);
      setPdfUrl(adminEditingBook.pdfUrl || '');
    } else {
      setTitle('');
      setAuthor('');
      setPrice('');
      setNo('');
      setCategory('Software Engineering');
      setStock('25');
      setTags('');
      setDesc('');
      setFullDesc('');
      setColor(COLOR_SWATCHES[0]);
      setPdfUrl('');
    }
  }, [adminEditingBook, isAdminFormOpen]);

  if (!isAdminFormOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !price) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const tagList = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    const bookData = {
      title: title.trim(),
      author: author.trim(),
      price: Math.max(0, parseInt(price, 10) || 0),
      no: no.trim() || '005.1 NLB',
      category: category.trim() || 'Software Engineering',
      stock: Math.max(0, parseInt(stock, 10) || 0),
      tags: tagList.length > 0 ? tagList : ['programming'],
      desc: desc.trim() || title.trim(),
      fullDesc: fullDesc.trim() || desc.trim(),
      color: color,
      pdfUrl: pdfUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    };

    saveAdminBook(bookData, adminEditingBook?.id);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAdminFormOpen(false)}>
      <div 
        className="modal-content wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>
            {adminEditingBook ? `Edit "${adminEditingBook.title}"` : 'Add New Book to Catalog'}
          </h3>
          <button className="modal-close-btn" onClick={() => setIsAdminFormOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Book Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Designing Event-Driven Systems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Author Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., E. Gamma"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Catalog No (Dewey)
              </label>
              <input
                type="text"
                placeholder="005.1 ARCH"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                placeholder="25"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Category
              </label>
              <input
                type="text"
                placeholder="Distributed Systems"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="concurrency, streams, kafka"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>
          </div>

          {/* Color Swatches */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Cover Palette Color
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {COLOR_SWATCHES.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: c,
                    border: color === c ? '2.5px solid #000' : '1px solid var(--border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                >
                  {color === c && <Check size={14} />}
                </button>
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '40px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Short Description (Card view)
            </label>
            <textarea
              rows={2}
              placeholder="One concise sentence explaining why engineers need this book."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Full Synopsis & Chapter Breakdown (Product page)
            </label>
            <textarea
              rows={4}
              placeholder="Full multi-paragraph description with architectural deep dives..."
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13.5px' }}
            />
          </div>

          {/* PDF URL */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              PDF Document / Google Drive Preview Link
            </label>
            <input
              type="url"
              placeholder="https://example.com/book.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '10px' }}>
            {adminEditingBook ? 'Update Book Details' : 'Publish Book to Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
