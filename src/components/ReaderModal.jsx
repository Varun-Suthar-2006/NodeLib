import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, ExternalLink, Sun, Moon, Coffee, 
  ZoomIn, ZoomOut, CheckCircle2, ChevronLeft, ChevronRight, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReaderModal() {
  const { readingBookId, closeReader, books, showToast } = useApp();
  const [readerTheme, setReaderTheme] = useState('light'); // 'light' | 'sepia' | 'dark'
  const [fontSize, setFontSize] = useState(18);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' | 'pdf'

  if (!readingBookId) return null;

  const book = books.find(b => b.id === readingBookId);
  if (!book) return null;

  const chapters = book.sampleChapters && book.sampleChapters.length > 0
    ? book.sampleChapters
    : [
        {
          title: 'Chapter 1: Foundations & Architecture',
          content: `${book.title} by ${book.author}\n\n${book.fullDesc || book.desc}\n\nWelcome to your full digital copy. This e-reader provides formatted text streams, typography controls, and distraction-free learning environments.`
        },
        {
          title: 'Chapter 2: Production Patterns',
          content: `In this chapter we dive deep into industry-tested heuristics for scaling systems without excessive complexity.\n\nAlways measure under realistic throughput before making premature optimizations.`
        }
      ];

  const handleFinishBook = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    showToast(`Congratulations! You completed reading "${book.title}"! 🎉`, 'success');
  };

  return (
    <div className="modal-overlay" onClick={closeReader}>
      <div 
        className="modal-content fullscreen"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 0 }}
      >
        {/* Reader Toolbar */}
        <div className="reader-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: book.color || 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px'
            }}>
              {book.title.split(' ').map(w => w[0]).join('').substring(0, 2)}
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {book.title}
              </h4>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                by {book.author} · Reading Mode
              </span>
            </div>
          </div>

          {/* Reader Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: 'var(--border)', padding: '2px', borderRadius: '8px' }}>
              <button
                className={`btn btn-sm ${viewMode === 'interactive' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '11.5px' }}
                onClick={() => setViewMode('interactive')}
              >
                Reader View
              </button>
              <button
                className={`btn btn-sm ${viewMode === 'pdf' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '11.5px' }}
                onClick={() => setViewMode('pdf')}
              >
                PDF Embed
              </button>
            </div>

            {/* Theme Toggle in Reader */}
            {viewMode === 'interactive' && (
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  className={`btn-icon ${readerTheme === 'light' ? 'active' : ''}`}
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setReaderTheme('light')}
                  title="Light Theme"
                >
                  <Sun size={15} />
                </button>
                <button 
                  className={`btn-icon ${readerTheme === 'sepia' ? 'active' : ''}`}
                  style={{ width: '32px', height: '32px', background: '#FBF0D9', color: '#433422' }}
                  onClick={() => setReaderTheme('sepia')}
                  title="Sepia Theme"
                >
                  <Coffee size={15} />
                </button>
                <button 
                  className={`btn-icon ${readerTheme === 'dark' ? 'active' : ''}`}
                  style={{ width: '32px', height: '32px', background: '#0F172A', color: '#F8FAFC' }}
                  onClick={() => setReaderTheme('dark')}
                  title="Dark Theme"
                >
                  <Moon size={15} />
                </button>
              </div>
            )}

            {/* Font Size Adjusters */}
            {viewMode === 'interactive' && (
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  className="btn-icon"
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                  title="Decrease Font Size"
                >
                  <ZoomOut size={15} />
                </button>
                <button 
                  className="btn-icon"
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                  title="Increase Font Size"
                >
                  <ZoomIn size={15} />
                </button>
              </div>
            )}

            {/* Finish Book Action */}
            <button 
              className="btn btn-sm"
              style={{ background: 'var(--emerald)', color: '#fff' }}
              onClick={handleFinishBook}
            >
              <CheckCircle2 size={14} /> Completed
            </button>

            {/* Close */}
            <button className="modal-close-btn" onClick={closeReader}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Reader Body Panel */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {viewMode === 'interactive' ? (
            <div className={`reader-body-panel theme-${readerTheme}`}>
              <div style={{ maxWidth: '750px', margin: '0 auto' }}>
                {/* Chapter Heading */}
                <div style={{ borderBottom: '1px solid currentColor', opacity: 0.8, paddingBottom: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: `${fontSize + 6}px`, fontWeight: 700, margin: 0 }}>
                    {chapters[activeChapterIndex].title}
                  </h2>
                  <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                    {activeChapterIndex + 1} / {chapters.length}
                  </span>
                </div>

                {/* Chapter Text */}
                <div style={{ fontSize: `${fontSize}px`, whiteSpace: 'pre-line', lineHeight: 1.85 }}>
                  {chapters[activeChapterIndex].content}
                </div>

                {/* Chapter Nav Foot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid currentColor', opacity: 0.7 }}>
                  <button 
                    className="btn btn-ghost btn-sm"
                    disabled={activeChapterIndex === 0}
                    onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                  >
                    <ChevronLeft size={16} /> Previous Chapter
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    disabled={activeChapterIndex === chapters.length - 1}
                    onClick={() => setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
                  >
                    Next Chapter <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC', padding: '16px' }}>
              <iframe 
                src={book.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                style={{ flex: 1, width: '100%', border: '1px solid var(--border)', borderRadius: '12px' }}
                title={book.title}
              />
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Host blocks iframe preview?{' '}
                <a 
                  href={book.pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Open PDF document in new browser tab <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
