import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Check, Image as ImageIcon, Upload, Link, 
  Sparkles, Palette, Trash2, Eye, BookOpen, Layers
} from 'lucide-react';

const COLOR_SWATCHES = [
  '#4F46E5', '#0284C7', '#059669', '#7C3AED', 
  '#D97706', '#DB2777', '#EA580C', '#0D9488', '#1E293B'
];

// Curated High-Definition Engineering Cover Art Presets
const COVER_PRESETS = [
  {
    name: 'Cloud & Kubernetes',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    color: '#0284C7'
  },
  {
    name: 'Code & Terminal',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    color: '#1E293B'
  },
  {
    name: 'Neural AI & Silicon',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    color: '#7C3AED'
  },
  {
    name: 'Cybersecurity Mesh',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    color: '#059669'
  },
  {
    name: 'System Architecture',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    color: '#4F46E5'
  },
  {
    name: 'Abstract Dark Wave',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    color: '#D97706'
  }
];

export default function AdminBookModal() {
  const { 
    isAdminFormOpen, setIsAdminFormOpen, 
    adminEditingBook, saveAdminBook, showToast 
  } = useApp();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [no, setNo] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('25');
  const [tags, setTags] = useState('');
  const [desc, setDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [color, setColor] = useState(COLOR_SWATCHES[0]);
  const [coverImage, setCoverImage] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);

  // Cover tab: 'image' | 'presets' | 'color'
  const [coverTab, setCoverTab] = useState('image');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (adminEditingBook) {
      setTitle(adminEditingBook.title || '');
      setAuthor(adminEditingBook.author || '');
      setPrice(String(adminEditingBook.price || ''));
      setOriginalPrice(String(adminEditingBook.originalPrice || ''));
      setNo(adminEditingBook.no || '');
      setCategory(adminEditingBook.category || '');
      setStock(String(adminEditingBook.stock ?? 25));
      setTags((adminEditingBook.tags || []).join(', '));
      setDesc(adminEditingBook.desc || '');
      setFullDesc(adminEditingBook.fullDesc || '');
      setColor(adminEditingBook.color || COLOR_SWATCHES[0]);
      setCoverImage(adminEditingBook.coverImage || adminEditingBook.imageUrl || '');
      setPdfUrl(adminEditingBook.pdfUrl || '');
      setFeatured(Boolean(adminEditingBook.featured));
      setBestSeller(Boolean(adminEditingBook.bestSeller));
    } else {
      setTitle('');
      setAuthor('');
      setPrice('');
      setOriginalPrice('');
      setNo('');
      setCategory('Software Engineering');
      setStock('25');
      setTags('');
      setDesc('');
      setFullDesc('');
      setColor(COLOR_SWATCHES[0]);
      setCoverImage('');
      setPdfUrl('');
      setFeatured(false);
      setBestSeller(false);
    }
  }, [adminEditingBook, isAdminFormOpen]);

  if (!isAdminFormOpen) return null;

  // Handle Local File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    // Limit to ~4MB for local storage safety
    if (file.size > 4 * 1024 * 1024) {
      showToast('Image file size is too large (max 4MB).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target.result);
      showToast('Cover image loaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const getInitials = (text) => {
    if (!text) return 'NL';
    return text.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

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
      originalPrice: originalPrice ? Math.max(0, parseInt(originalPrice, 10) || 0) : null,
      no: no.trim() || '005.1 NLB',
      category: category.trim() || 'Software Engineering',
      stock: Math.max(0, parseInt(stock, 10) || 0),
      tags: tagList.length > 0 ? tagList : ['programming'],
      desc: desc.trim() || title.trim(),
      fullDesc: fullDesc.trim() || desc.trim(),
      color: color,
      coverImage: coverImage.trim() || null,
      imageUrl: coverImage.trim() || null,
      pdfUrl: pdfUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      featured: featured,
      bestSeller: bestSeller
    };

    saveAdminBook(bookData, adminEditingBook?.id);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAdminFormOpen(false)}>
      <div 
        className="modal-content wide animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '920px', padding: '0', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          color: '#FFFFFF',
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#93C5FD',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              <BookOpen size={13} /> INVENTORY &amp; CATALOG MANAGEMENT
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {adminEditingBook ? `Edit "${adminEditingBook.title}"` : 'Add New E-Book to Inventory'}
            </h3>
          </div>
          <button 
            className="modal-close-btn" 
            style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setIsAdminFormOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Two Columns (Form on left, Live Cover Preview on right) */}
        <form onSubmit={handleSubmit}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.45fr 1fr',
            gap: '0',
            maxHeight: '78vh',
            overflowY: 'auto'
          }}>
            {/* Left Column: Form Fields */}
            <div style={{ padding: '24px 28px', display: 'grid', gap: '16px', borderRight: '1px solid var(--border)' }}>
              
              {/* Row 1: Title & Author */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Designing Event-Driven Systems"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Martin Kleppmann"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION: COVER PAGE IMAGE & ARTWORK */}
              {/* ========================================================= */}
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1.5px solid var(--primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'grid',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>
                    <ImageIcon size={16} /> Cover Page Image &amp; Design
                  </div>
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--rose)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={12} /> Remove Image
                    </button>
                  )}
                </div>

                {/* Cover Tabs */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${coverTab === 'image' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '6px 10px', fontSize: '11.5px', gap: '4px' }}
                    onClick={() => setCoverTab('image')}
                  >
                    <Upload size={13} /> Image Upload / URL
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${coverTab === 'presets' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '6px 10px', fontSize: '11.5px', gap: '4px' }}
                    onClick={() => setCoverTab('presets')}
                  >
                    <Sparkles size={13} /> Curated Presets
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${coverTab === 'color' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '6px 10px', fontSize: '11.5px', gap: '4px' }}
                    onClick={() => setCoverTab('color')}
                  >
                    <Palette size={13} /> Gradient Color
                  </button>
                </div>

                {/* TAB 1: Image Upload / URL */}
                {coverTab === 'image' && (
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {/* File Upload Trigger */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '1.5px dashed var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--surface)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Upload size={20} style={{ color: 'var(--primary)', margin: '0 auto 4px' }} />
                      <div style={{ fontSize: '12px', fontWeight: 700 }}>
                        Click to Upload Cover Image from Device
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                        Supports PNG, JPG, WebP (Max 4MB)
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                    </div>

                    {/* Direct Image URL input */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '4px' }}>
                        Or Paste Web Image Link:
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: Curated Engineering Presets */}
                {coverTab === 'presets' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '6px' }}>
                      Click any artwork to apply instantly:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {COVER_PRESETS.map((preset) => (
                        <div
                          key={preset.name}
                          onClick={() => {
                            setCoverImage(preset.url);
                            setColor(preset.color);
                          }}
                          style={{
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: coverImage === preset.url ? '2px solid var(--primary)' : '1px solid var(--border)',
                            cursor: 'pointer',
                            position: 'relative',
                            aspectRatio: '3/4',
                            background: '#0F172A'
                          }}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                            color: '#FFF',
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '4px',
                            textAlign: 'center'
                          }}>
                            {preset.name}
                          </div>
                          {coverImage === preset.url && (
                            <div style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              background: 'var(--primary)',
                              color: '#FFF',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Check size={11} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: Gradient Color */}
                {coverTab === 'color' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, marginBottom: '6px' }}>
                      Base Theme / Fallback Gradient:
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {COLOR_SWATCHES.map(c => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setColor(c)}
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            background: c,
                            border: color === c ? '2.5px solid #000' : '1px solid var(--border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff'
                          }}
                        >
                          {color === c && <Check size={13} />}
                        </button>
                      ))}
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ width: '36px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2: Price, Dewey Catalog No, Initial Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    Catalog No (Dewey)
                  </label>
                  <input
                    type="text"
                    placeholder="005.1 ARCH"
                    value={no}
                    onChange={(e) => setNo(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Row 3: Category & Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    Discipline / Category
                  </label>
                  <input
                    type="text"
                    placeholder="Distributed Systems"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="concurrency, kafka, microservices"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                  Short Card Synopsis
                </label>
                <textarea
                  rows={2}
                  placeholder="One concise sentence explaining why engineers need this book."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                  Full Chapter Synopsis &amp; Architecture Breakdown
                </label>
                <textarea
                  rows={3}
                  placeholder="Full multi-paragraph description with architectural deep dives..."
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                />
              </div>

              {/* PDF Document URL */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                  PDF E-Book Reader URL / Google Drive Link
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/ebook.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '13px' }}
                />
              </div>

              {/* Badges Toggle */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  Mark as Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={bestSeller}
                    onChange={(e) => setBestSeller(e.target.checked)}
                  />
                  Mark as Bestseller
                </label>
              </div>
            </div>

            {/* Right Column: Live Storefront Card Preview */}
            <div style={{
              background: 'var(--surface-subtle)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Eye size={13} /> Live Storefront Preview
              </div>

              {/* Mock Book Card */}
              <div style={{
                width: '240px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px',
                boxShadow: 'var(--shadow-md)',
                display: 'grid',
                gap: '10px'
              }}>
                {/* Book Cover Area */}
                <div style={{
                  width: '100%',
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  background: coverImage ? '#0F172A' : `linear-gradient(145deg, ${color} 0%, #1E1B4B 100%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '14px',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}>
                  {coverImage ? (
                    <>
                      <img 
                        src={coverImage} 
                        alt="Preview"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Gradient Overlay for Text Legibility */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.2) 50%, rgba(15,23,42,0.7) 100%)'
                      }} />
                    </>
                  ) : null}

                  {/* Top Bar inside cover */}
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    <span>NO. {no || '005.1 NLB'}</span>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px' }}>DIGITAL</span>
                  </div>

                  {/* Middle Title / Initials */}
                  <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    {!coverImage && (
                      <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                        {getInitials(title)}
                      </div>
                    )}
                    <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '4px', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                      {title || 'Book Title Preview'}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.85, marginTop: '2px' }}>
                      by {author || 'Author Name'}
                    </div>
                  </div>

                  {/* Bottom Foot inside cover */}
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', opacity: 0.8 }}>
                    <span>NODELIB</span>
                    <span>DRM-FREE</span>
                  </div>
                </div>

                {/* Meta details below cover */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    ₹{price || '499'}
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--emerald-text)', background: 'var(--emerald-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                    {stock || 25} in stock
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '14px', maxWidth: '240px' }}>
                Your custom cover will appear across the catalog, product pages, and customer digital library shelves.
              </p>
            </div>
          </div>

          {/* Modal Footer / Action */}
          <div style={{
            padding: '16px 28px',
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={() => setIsAdminFormOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ minWidth: '180px' }}
            >
              {adminEditingBook ? 'Save Changes' : '✓ Publish to Storefront'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
