import React from 'react';
import { useApp } from '../context/AppContext';
import { MEMBERSHIP_PLANS } from '../data/seedBooks';
import { Check, Sparkles, Award, GraduationCap, ArrowRight } from 'lucide-react';

export default function MembershipView() {
  const { subscription, activatePlan } = useApp();

  return (
    <div className="wrap" style={{ padding: '40px 0 70px' }}>
      <div className="section-head">
        <div>
          <div className="section-kicker">MEMBERSHIP PRIVILEGES</div>
          <h2 className="section-title">Read More. Save More.</h2>
        </div>
        <span className="tag-pill" style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 700 }}>
          Flexible Monthly / Annual Plans
        </span>
      </div>

      {/* Feature Banner */}
      <div className="feature-banner" style={{ marginBottom: '36px' }}>
        <div>
          <div className="section-kicker" style={{ color: '#93C5FD' }}>
            <Sparkles size={14} /> UNLIMITED DIGITAL ACCESS
          </div>
          <h3>NodeLib Reader Club</h3>
          <p>
            Unlock exclusive member discounts, automated price-drop alerts, algorithmic book shortlists, and monthly bundle credits. Benefits are applied automatically during checkout.
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Plan</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
            {subscription.plan ? subscription.plan.toUpperCase() : 'FREE'}
          </div>
        </div>
      </div>

      {/* Pricing Plans Grid */}
      <div className="membership-grid">
        {MEMBERSHIP_PLANS.map(plan => {
          const isActive = subscription.plan === plan.id;
          return (
            <div 
              key={plan.id}
              className={`membership-card ${plan.featured ? 'featured' : ''}`}
            >
              {plan.featured && (
                <span className="badge-pill featured" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  {plan.badge}
                </span>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{plan.name}</h3>
              <div className="membership-price">
                {plan.price}
                <small style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {plan.sub}
                </small>
              </div>

              {plan.discountPercent > 0 && (
                <div style={{
                  background: 'var(--emerald-bg)',
                  color: 'var(--emerald-text)',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  ✓ Save {plan.discountPercent}% on every book
                </div>
              )}

              <ul className="membership-features-list">
                {plan.features.map((feat, i) => (
                  <li key={i}>
                    <Check size={16} color="var(--emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                style={{ width: '100%', marginTop: 'auto' }}
                disabled={isActive}
                onClick={() => activatePlan(plan.id)}
              >
                {isActive ? 'Current Plan Active ✓' : `Choose ${plan.name} →`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Student Special Plan */}
      <div style={{ marginTop: '50px' }}>
        <div className="section-head">
          <div>
            <div className="section-kicker">ACADEMIC & SCHOLARSHIP</div>
            <h3 className="section-title">Student Reader Access</h3>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GraduationCap size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '20px', fontWeight: 800 }}>Student Reader Pass — ₹99/month</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px', maxWidth: '550px' }}>
                Special subsidized rates for engineering students, bootcamp learners, and academic researchers. Includes 15% discount on all foundational textbooks.
              </p>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => activatePlan('student')}
          >
            Activate Student Plan (₹99/mo) <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
