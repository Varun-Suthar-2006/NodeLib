import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthOpen, setIsAuthOpen, 
    authMode, setAuthMode, 
    handleAuthSubmit, showToast 
  } = useApp();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (authMode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    handleAuthSubmit(email.trim().toLowerCase(), name.trim(), password, authMode);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '440px' }}
      >
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>
            {authMode === 'signin' ? 'Sign In to NodeLib' : 'Create Your Account'}
          </h3>
          <button className="modal-close-btn" onClick={() => setIsAuthOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          marginBottom: '20px'
        }}>
          <button
            className={`btn btn-sm ${authMode === 'signin' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, border: 'none', boxShadow: authMode === 'signin' ? 'var(--shadow-xs)' : 'none' }}
            onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
          >
            Sign In
          </button>
          <button
            className={`btn btn-sm ${authMode === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, border: 'none', boxShadow: authMode === 'signup' ? 'var(--shadow-xs)' : 'none' }}
            onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div style={{
            background: 'var(--rose-bg)',
            color: 'var(--rose-text)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '16px',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          {authMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g., Ada Lovelace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="developer@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: '14px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '6px' }}
          >
            {authMode === 'signin' ? 'Sign In →' : 'Continue to Email Verification →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          By continuing, you agree to NodeLib's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
