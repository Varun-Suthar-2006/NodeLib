import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, HelpCircle, Mail, MessageSquare, 
  Send, ShieldCheck, Github, Twitter, Linkedin, Heart, Shield 
} from 'lucide-react';

export function AboutView() {
  const { navigateTo } = useApp();

  return (
    <div className="wrap" style={{ padding: '40px 0 70px' }}>
      <div className="section-head">
        <div>
          <div className="section-kicker">OUR MISSION</div>
          <h2 className="section-title">About NodeLib</h2>
        </div>
      </div>

      <div className="feature-banner" style={{ marginBottom: '32px' }}>
        <div>
          <div className="section-kicker" style={{ color: '#93C5FD' }}>
            <Sparkles size={14} /> DEWEY DECIMAL 005.1
          </div>
          <h3>Every great idea gets indexed.</h3>
          <p>
            NodeLib was founded to eliminate endless scrolling through mediocre tutorials. We curate, publish, and distribute high-signal technical books engineered for developers, architects, and engineering leaders.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Pragmatic Engineering</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Every chapter is grounded in real production constraints—concurrency races, memory limits, distributed partition tolerance, and query planners.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>DRM-Free Freedom</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            You buy the book, you own the book. Read in our responsive web e-reader or download full resolution PDF documents anytime.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>Algorithmic Discovery</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Our smart recommendation engine measures your reading habits and goals to suggest titles that accelerate your engineering career.
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqView() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How do I access my purchased books?',
      a: 'Immediately upon completing checkout, all purchased titles appear in your personal "My Library" view. You can read them directly using our built-in distraction-free e-reader or download the PDF format.'
    },
    {
      q: 'How does the NodeLib Membership work?',
      a: 'Members receive automatic discounts (5% to 20%) on all bookstore purchases, early chapter drops, price-drop notifications, and algorithmically personalized reading challenges.'
    },
    {
      q: 'Are payments secure?',
      a: 'Yes. NodeLib integrates with trusted payment gateways including Razorpay, UPI, credit/debit cards, and Net Banking with end-to-end encryption.'
    },
    {
      q: 'What is the Dewey Decimal reference (005.1)?',
      a: 'In library classification, 005.1 specifically designates "Computer Programming, Programs, and Software Engineering". NodeLib is organized around rigorous indexing of technical knowledge.'
    },
    {
      q: 'Can I read offline?',
      a: 'Yes. All titles support PDF viewing and can be opened in external PDF readers for offline travel reading.'
    }
  ];

  return (
    <div className="wrap" style={{ padding: '40px 0 70px' }}>
      <div className="section-head">
        <div>
          <div className="section-kicker">FREQUENTLY ASKED QUESTIONS</div>
          <h2 className="section-title">Got Questions? We’ve Got Answers.</h2>
        </div>
      </div>

      <div style={{ maxWidth: '820px', display: 'grid', gap: '14px' }}>
        {faqs.map((faq, idx) => (
          <div 
            key={idx}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 22px',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {faq.q}
              </h4>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
                {openIdx === idx ? '−' : '+'}
              </span>
            </div>
            {openIdx === idx && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.65, marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactView() {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to the NodeLib editorial team!', 'success');
  };

  return (
    <div className="wrap" style={{ padding: '40px 0 70px' }}>
      <div className="section-head">
        <div>
          <div className="section-kicker">GET IN TOUCH</div>
          <h2 className="section-title">Contact & Editorial Support</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'start' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Send us a message</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
            Looking for author publishing inquiries, student licensing, or technical feedback?
          </p>

          {submitted ? (
            <div style={{ background: 'var(--emerald-bg)', color: 'var(--emerald-text)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 700 }}>
              ✓ Thank you! We have received your message and will respond within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Your Name</label>
                <input required type="text" placeholder="Ada Lovelace" style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Email Address</label>
                <input required type="email" placeholder="ada@domain.com" style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Subject</label>
                <input required type="text" placeholder="Publishing Inquiry / Support" style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Message</label>
                <textarea required rows={4} placeholder="How can we help you?" style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={16} /> Send Message →
              </button>
            </form>
          )}
        </div>

        <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '14px' }}>NodeLib Editorial HQ</h3>
          <div style={{ display: 'grid', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <div>
              <strong>Email:</strong> support@nodelib.example
            </div>
            <div>
              <strong>Editorial Submissions:</strong> manuscripts@nodelib.example
            </div>
            <div>
              <strong>Office Hours:</strong> Mon – Fri, 9:00 AM – 6:00 PM IST
            </div>
            <div>
              <strong>Location:</strong> Bengaluru / Global Remote
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const { navigateTo } = useApp();

  return (
    <footer>
      <div className="wrap footer-inner">
        <div>
          <div className="brand" onClick={() => navigateTo('catalog')} style={{ marginBottom: '8px' }}>
            <span className="brand-mark">005.1</span>
            <div className="brand-text-group">
              <span className="brand-name">Node<em>Lib</em></span>
              <span className="brand-byline">by Lotus &amp; Lithium</span>
            </div>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '340px' }}>
            Smart digital bookstore & e-library engineered for modern developers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '24px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
          <button onClick={() => navigateTo('catalog')}>Explore</button>
          <button onClick={() => navigateTo('library')}>My Library</button>
          <button onClick={() => navigateTo('about')}>About Us</button>
          <button onClick={() => navigateTo('faq')}>FAQ</button>
          <button onClick={() => navigateTo('contact')}>Contact & Support</button>
          <button 
            onClick={() => navigateTo('admin')} 
            style={{ color: 'var(--text-muted)', fontSize: '12px', opacity: 0.7 }}
            title="Owner & Staff Login"
          >
            Staff Portal
          </button>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © 2026 NodeLib Inc. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
