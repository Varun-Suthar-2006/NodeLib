import React, { useState } from 'react';
import { isSupabaseConfigured, SUPABASE_URL, SUPABASE_ANON_KEY, setCustomSupabaseCredentials, clearCustomSupabaseCredentials } from '../services/supabaseClient';
import { X, Database, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';

export default function SupabaseConfigModal({ isOpen, onClose }) {
  const [url, setUrl] = useState(SUPABASE_URL || '');
  const [key, setKey] = useState(SUPABASE_ANON_KEY || '');
  const isConnected = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCustomSupabaseCredentials(url, key);
  };

  const handleDisconnect = () => {
    clearCustomSupabaseCredentials();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '480px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={22} color={isConnected ? 'var(--emerald)' : 'var(--primary)'} />
            <h3 style={{ margin: 0 }}>Supabase PostgreSQL Database</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: isConnected ? 'var(--emerald-bg)' : 'var(--primary-light)',
          color: isConnected ? 'var(--emerald-text)' : 'var(--primary)',
          fontSize: '13.5px',
          fontWeight: 700,
          marginBottom: '20px'
        }}>
          {isConnected ? (
            <>
              <CheckCircle2 size={18} />
              <span>Connected to live Supabase Cloud Database</span>
            </>
          ) : (
            <>
              <AlertCircle size={18} />
              <span>Offline / Local Storage Mode (Connect Supabase below)</span>
            </>
          )}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', lineHeight: 1.55, marginBottom: '18px' }}>
          Connect your <strong>Supabase PostgreSQL</strong> project to synchronize customer logins, orders, library entitlements, and catalog data to the cloud.
        </p>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Supabase Project URL
            </label>
            <input
              type="url"
              required
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Supabase Anon Public API Key
            </label>
            <textarea
              rows={3}
              required
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Save & Connect Database →
            </button>
            {isConnected && (
              <button 
                type="button" 
                className="btn btn-ghost" 
                style={{ color: 'var(--rose)' }}
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            )}
          </div>
        </form>

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '14px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
          <div>1. Create a free project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>supabase.com <ExternalLink size={12} style={{ display: 'inline' }} /></a></div>
          <div style={{ marginTop: '4px' }}>2. Run the provided <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--surface-subtle)', padding: '2px 4px', borderRadius: '4px' }}>supabase_schema.sql</code> script in the SQL Editor.</div>
        </div>
      </div>
    </div>
  );
}
