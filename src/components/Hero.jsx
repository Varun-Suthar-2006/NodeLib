import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, BookOpen, Star, Zap, ShieldCheck } from 'lucide-react';

export default function Hero() {
  const { currentUser, books, setIsFinderOpen, navigateTo } = useApp();

  return (
    <section className="hero-section" id="hero-section">
      <div className="wrap hero-grid">
        {/* Left Column: Text & CTAs */}
        <div>
          {currentUser && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 800,
              color: 'var(--primary)',
              marginBottom: '12px',
              background: 'var(--primary-light)',
              padding: '6px 14px',
              borderRadius: '99px'
            }}>
              👋 Welcome back, {currentUser.name}!
            </div>
          )}

          <div className="hero-badge">
            <Sparkles size={14} /> SMART DISCOVERY · PERSONALIZED READING
          </div>

          <h1 className="hero-title">
            Find the right book.<br />
            <span className="accent-text">Not just another book.</span>
          </h1>

          <p className="hero-lede">
            NodeLib combines a curated software engineering library, personalized recommendation algorithms, and actionable buying insights to make every learning decision effortless.
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setIsFinderOpen(true)}
            >
              Find My Book <ArrowRight size={18} />
            </button>
            <button 
              className="btn btn-ghost btn-lg"
              onClick={() => {
                const catalogEl = document.getElementById('catalog-section');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigateTo('catalog');
                }
              }}
            >
              Explore Catalog
            </button>
          </div>

          {/* Quick Stat Strip */}
          <div className="smart-stat-strip">
            <div className="smart-stat-card">
              <strong>{books.length}+</strong>
              <span>Curated Titles</span>
            </div>
            <div className="smart-stat-card">
              <strong>4.9 ★</strong>
              <span>Reader Score</span>
            </div>
            <div className="smart-stat-card">
              <strong>0 sec</strong>
              <span>Instant Access</span>
            </div>
            <div className="smart-stat-card">
              <strong>100%</strong>
              <span>DRM-Free PDF</span>
            </div>
          </div>
        </div>

        {/* Right Column: Solar Hero Animation */}
        <div>
          <div className="solar-hero-container">
            {/* Orbit 1 */}
            <div className="solar-orbit orbit-ring-1">
              <div className="orbit-badge-node">
                <div className="orbit-icon-pill">&lt;/&gt;</div>
              </div>
            </div>

            {/* Orbit 2 */}
            <div className="solar-orbit orbit-ring-2">
              <div className="orbit-badge-node">
                <div className="orbit-icon-pill">☁</div>
              </div>
            </div>

            {/* Orbit 3 */}
            <div className="solar-orbit orbit-ring-3">
              <div className="orbit-badge-node">
                <div className="orbit-icon-pill">⚙</div>
              </div>
            </div>

            {/* Orbit 4 */}
            <div className="solar-orbit orbit-ring-4">
              <div className="orbit-badge-node">
                <div className="orbit-icon-pill">🗄</div>
              </div>
            </div>

            {/* Orbit 5 */}
            <div className="solar-orbit orbit-ring-5">
              <div className="orbit-badge-node">
                <div className="orbit-icon-pill">⚡</div>
              </div>
            </div>

            {/* 3D Stacked Book Centerpiece */}
            <div 
              className="interactive-book-stack"
              onClick={() => navigateTo('catalog')}
              title="Click to browse complete catalog"
            >
              <div className="stacked-layer layer-3"></div>
              <div className="stacked-layer layer-2"></div>
              <div className="stacked-layer layer-1">
                <strong>NodeLib</strong>
                <span>DIGITAL LIBRARY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
