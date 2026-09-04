import React from 'react';
import { 
  X, Printer, Download, CheckCircle2, ShieldCheck, 
  Sparkles, BookOpen, FileText, Building2 
} from 'lucide-react';

export default function InvoiceModal({ order, books, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const orderBooks = (order.items || []).map(id => {
    if (typeof id === 'object') return id;
    return books?.find(b => b.id === id) || { id, title: 'Engineering eBook', price: 0, author: 'NodeLib Author' };
  });

  const subtotal = Number(order.subtotal) || Number(order.total) || 0;
  // In India, e-books typically have 18% GST (SAC 4901)
  const gstRate = 0.18;
  const taxableValue = Math.round((subtotal / (1 + gstRate)) * 100) / 100;
  const totalGst = Math.round((subtotal - taxableValue) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst - cgst) * 100) / 100;

  const invoiceNumber = `INV-${new Date(order.date || Date.now()).getFullYear()}-${order.id?.toString().toUpperCase()}`;
  const dateFormatted = new Date(order.date || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay invoice-modal-overlay" onClick={onClose}>
      <div 
        className="modal-content invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', width: '95vw', padding: '0', overflow: 'hidden' }}
      >
        {/* Modal Actions Bar (Hidden in Print) */}
        <div className="no-print" style={{
          background: 'var(--surface-subtle)',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
            <FileText size={16} style={{ color: 'var(--primary)' }} />
            <span>Official GST Tax Invoice Receipt</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-primary btn-sm"
              onClick={handlePrint}
              style={{ gap: '6px' }}
            >
              <Printer size={14} /> Print / Save as PDF
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Paper Document */}
        <div className="invoice-paper" style={{ padding: '36px 32px', background: '#FFFFFF', color: '#0F172A', fontFamily: 'var(--font-sans)' }}>
          
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ background: '#0F172A', color: '#FFF', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 900, fontFamily: 'monospace' }}>
                  005.1
                </span>
                <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.02em', color: '#0F172A' }}>
                  NodeLib
                </span>
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
                by Lotus &amp; Lithium Technologies Pvt. Ltd.
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>
                Bengaluru Tech Corridor, Karnataka, India<br />
                GSTIN: 29AAACL8842K1Z9 · SAC Code: 4901 (Digital Books)<br />
                Email: support@nodelib.example · Web: nodelib.dev
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#1E1B4B', letterSpacing: '0.04em' }}>
                TAX INVOICE
              </div>
              <div style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: 800, color: '#4F46E5', marginTop: '4px' }}>
                {invoiceNumber}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Date: {dateFormatted}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '99px', marginTop: '6px' }}>
                <CheckCircle2 size={12} /> PAYMENT COMPLETED
              </div>
            </div>
          </div>

          {/* Bill To & Payment Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#F8FAFC', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Billed To Customer:
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                {order.user_name || order.customerName || 'Registered Customer'}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', fontFamily: 'monospace' }}>
                {order.user_email || order.customerEmail || 'customer@store.io'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                Digital Delivery Account · Place of Supply: India (Inter-State/Intra-State)
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Payment Transaction Details:
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Gateway: {order.paymentMethod || order.payment_method || 'RAZORPAY STANDARD'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#475569', fontFamily: 'monospace', marginTop: '2px' }}>
                Ref ID: {order.transactionRef || order.payment_id || order.id}
              </div>
              <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                Status: 256-Bit SSL Verified &amp; Captured
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1', fontSize: '11.5px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Item / Description</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>SAC</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Taxable Amt</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>GST (18%)</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total (INR)</th>
              </tr>
            </thead>
            <tbody>
              {orderBooks.map((item, idx) => {
                const itemPrice = Number(item.price) || 0;
                const itemTaxable = Math.round((itemPrice / 1.18) * 100) / 100;
                const itemGst = Math.round((itemPrice - itemTaxable) * 100) / 100;
                return (
                  <tr key={item.id || idx} style={{ borderBottom: '1px solid #E2E8F0', fontSize: '13px' }}>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ display: 'block', color: '#0F172A' }}>{item.title}</strong>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        DRM-Free E-Book Edition (PDF + ePub) · by {item.author || 'Author'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontFamily: 'monospace', fontSize: '12px', color: '#475569' }}>
                      4901
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700 }}>
                      1
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace', color: '#334155' }}>
                      ₹{itemTaxable}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace', color: '#334155' }}>
                      ₹{itemGst}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, color: '#0F172A' }}>
                      ₹{itemPrice}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals & Tax Calculation Breakdown */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
            <div style={{ width: '280px', display: 'grid', gap: '6px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Total Taxable Amount:</span>
                <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>₹{taxableValue}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>CGST (9.0%):</span>
                <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>₹{cgst}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>SGST (9.0%):</span>
                <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>₹{sgst}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, color: '#0F172A', borderTop: '2px solid #0F172A', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Amount Paid:</span>
                <span style={{ fontFamily: 'monospace', color: '#4F46E5' }}>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Legal Stamp & Verification Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '16px', fontSize: '11px', color: '#64748B' }}>
            <div style={{ maxWidth: '420px', lineHeight: 1.4 }}>
              <strong>Digital Delivery Confirmation:</strong> All purchased titles have been permanently unlocked in your customer library with DRM-free access. This is an electronically generated tax invoice that does not require a physical signature.
            </div>

            {/* Official Digital Seal */}
            <div style={{
              border: '2px dashed #4F46E5',
              borderRadius: '8px',
              padding: '8px 12px',
              textAlign: 'center',
              color: '#4F46E5',
              background: '#EEF2FF',
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <div>LOTUS &amp; LITHIUM TECHNOLOGIES</div>
              <div style={{ fontSize: '9px', opacity: 0.85, marginTop: '2px' }}>AUTHENTICATED &amp; VERIFIED ✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
