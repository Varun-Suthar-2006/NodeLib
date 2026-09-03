import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Eye, ShoppingBag, DollarSign, TrendingUp, 
  Sparkles, Compass, BarChart3, Bookmark 
} from 'lucide-react';

export default function InsightsView() {
  const { activity, library, orders, books, getScoredRecommendations, navigateTo } = useApp();

  const totalViews = Object.values(activity.views || {}).reduce((sum, v) => sum + v, 0);
  const totalCartAdds = Object.values(activity.cartAdds || {}).reduce((sum, c) => sum + c, 0);
  const totalPurchases = library.length;
  const avgOrder = orders.length > 0 
    ? Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length) 
    : 0;

  const categories = Object.entries(activity.categories || {}).sort((a, b) => b[1] - a[1]);
  const maxCatValue = categories.length > 0 ? Math.max(...categories.map(c => c[1])) : 1;

  const topRecommendations = getScoredRecommendations(5);

  return (
    <div className="wrap" style={{ padding: '40px 0 70px' }}>
      <div className="section-head">
        <div>
          <div className="section-kicker">PERSONALIZED ANALYTICS</div>
          <h2 className="section-title">Your Reading & Buying Insights</h2>
        </div>
        <span className="tag-pill" style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 700 }}>
          Live Behavioral Scoring
        </span>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Books Viewed</span>
            <Eye size={18} color="var(--primary)" />
          </div>
          <strong style={{ fontSize: '28px', fontFamily: 'var(--font-mono)' }}>{totalViews}</strong>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Cart Additions</span>
            <ShoppingBag size={18} color="var(--accent)" />
          </div>
          <strong style={{ fontSize: '28px', fontFamily: 'var(--font-mono)' }}>{totalCartAdds}</strong>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Books Owned</span>
            <Bookmark size={18} color="var(--emerald)" />
          </div>
          <strong style={{ fontSize: '28px', fontFamily: 'var(--font-mono)' }}>{totalPurchases}</strong>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Average Spend</span>
            <DollarSign size={18} color="var(--gold-text)" />
          </div>
          <strong style={{ fontSize: '28px', fontFamily: 'var(--font-mono)' }}>₹{avgOrder}</strong>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Left Column: Interest Signal Bar Chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
          <div className="section-kicker">INTEREST SIGNALS</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
            Topics You Explore Most
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '24px' }}>
            As you browse and save books, NodeLib weights your interest to tailor discoverability.
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {(categories.length > 0 ? categories : [['Software Architecture', 4], ['Databases & SQL', 3], ['Async & Concurrency', 2], ['Refactoring', 1]]).map(([cat, val], idx) => {
              const pct = Math.max(15, Math.min(100, Math.round((val / maxCatValue) * 100)));
              return (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 45px', alignItems: 'center', gap: '14px', fontSize: '13.5px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat}
                  </span>
                  <div style={{ height: '8px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'var(--primary-gradient)',
                      borderRadius: '99px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                  <strong style={{ fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    {val}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tailored Next Reads */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
          <div className="section-kicker">TAILORED RECOMMENDATIONS</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
            High-Impact Next Reads
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
            Ranked using your real-time interest weights and reading history.
          </p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {topRecommendations.map((book, i) => (
              <div 
                key={book.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-subtle)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onClick={() => navigateTo('product', book.id)}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: book.color || 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {book.title}
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    by {book.author} · ₹{book.price}
                  </span>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: '11.5px' }}>
                  View →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
