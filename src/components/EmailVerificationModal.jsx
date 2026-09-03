import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function EmailVerificationModal() {
  const { 
    isVerificationOpen, setIsVerificationOpen, 
    pendingUser, demoOtp, verifyOtpCode, 
    setIsAuthOpen, showToast 
  } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isVerificationOpen || !pendingUser) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const success = verifyOtpCode(otpInput);
    if (!success) {
      setErrorMessage(`Incorrect verification code. Please enter: ${demoOtp}`);
    }
  };

  const handleResend = () => {
    showToast(`Verification code resent: ${demoOtp}`, 'info');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsVerificationOpen(false)}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '440px', textAlign: 'center' }}
      >
        <div className="modal-header">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setIsVerificationOpen(false);
              setIsAuthOpen(true);
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button className="modal-close-btn" onClick={() => setIsVerificationOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Mail size={32} />
        </div>

        <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
          Check your inbox
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
          We generated a 6-digit confirmation code for <strong>{pendingUser.email}</strong>.
        </p>

        {/* Demo OTP Helper Pill */}
        <div style={{
          background: 'var(--surface-subtle)',
          border: '1px dashed var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            DEMO VERIFICATION OTP
          </span>
          <strong style={{ fontSize: '24px', letterSpacing: '0.25em', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
            {demoOtp}
          </strong>
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

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{
                width: '100%',
                fontSize: '28px',
                fontWeight: 900,
                letterSpacing: '0.3em',
                textAlign: 'center',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border)',
                background: 'var(--surface)',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={otpInput.length !== 6}
          >
            Verify Email & Sign In →
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
          <button 
            type="button" 
            className="btn btn-ghost btn-sm"
            onClick={handleResend}
          >
            <RefreshCw size={14} /> Resend OTP Code
          </button>
        </div>
      </div>
    </div>
  );
}
