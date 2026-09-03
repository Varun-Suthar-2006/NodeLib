import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, ShieldCheck, CheckCircle2, QrCode, 
  CreditCard, Smartphone, Building2, Lock, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, setIsCheckoutOpen, 
    checkoutItems, books, subscription,
    selectedPayment, setSelectedPayment, 
    processPayment, showToast
  } = useApp();

  // Payment Gateway Tab: 'razorpay' | 'upi' | 'card' | 'netbanking'
  const [gatewayTab, setGatewayTab] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI Inputs
  const [upiVpa, setUpiVpa] = useState('');
  const [upiApproved, setUpiApproved] = useState(false);

  // Bank Input
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isCheckoutOpen) return null;

  const purchasedBooks = checkoutItems.map(id => books.find(b => b.id === id)).filter(Boolean);
  const subtotal = purchasedBooks.reduce((sum, b) => sum + b.price, 0);

  const finalTotal = subtotal;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(raw.substring(0, 2) + '/' + raw.substring(2));
    } else {
      setCardExpiry(raw);
    }
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    
    // Step 1: Gateway Handshake
    setProcessingStep(`Initiating secure 256-bit payment session via ${gatewayTab.toUpperCase()}...`);
    await new Promise(r => setTimeout(r, 650));

    // Step 2: Authorization
    setProcessingStep(`Authorizing ₹${finalTotal} with payment provider...`);
    await new Promise(r => setTimeout(r, 750));

    // Step 3: Transaction Capture
    const txnRef = gatewayTab === 'razorpay' ? `pay_rzp_${Math.random().toString(36).substring(2, 12)}` :
                   gatewayTab === 'upi' ? `upi_utr_${Math.floor(100000000000 + Math.random() * 900000000000)}` :
                   `card_auth_${Math.random().toString(36).substring(2, 10)}`;

    setProcessingStep(`Payment Captured (${txnRef}). Writing invoice to PostgreSQL database...`);
    await new Promise(r => setTimeout(r, 650));

    // Payment method detail metadata for analytics
    const methodDetails = {
      gateway: gatewayTab.toUpperCase(),
      txnRef,
      mode: gatewayTab === 'card' ? `Card (ending ${cardNumber.slice(-4) || '4242'})` :
            gatewayTab === 'upi' ? `UPI (${upiVpa || 'instant_qr'})` :
            gatewayTab === 'netbanking' ? `NetBanking (${selectedBank})` : 'Razorpay Express'
    };

    // Execute core payment & database save
    await processPayment(gatewayTab, txnRef, methodDetails);

    setIsProcessing(false);
    setProcessingStep('');
  };

  return (
    <div className="modal-overlay" onClick={() => !isProcessing && setIsCheckoutOpen(false)}>
      <div 
        className="modal-content wide"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          color: '#FFFFFF',
          padding: '22px 28px',
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
              <ShieldCheck size={14} /> 256-BIT ENCRYPTED CHECKOUT
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
              Complete Your Digital E-Book Purchase
            </h3>
          </div>
          {!isProcessing && (
            <button 
              className="modal-close-btn" 
              style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => setIsCheckoutOpen(false)}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body: 2 Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', minHeight: '440px' }}>
          
          {/* Left Column: Payment Methods */}
          <div style={{ padding: '26px 28px', borderRight: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
              Select Payment Method
            </h4>

            {/* Gateway Selector Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                className={`btn btn-sm ${gatewayTab === 'razorpay' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                onClick={() => setGatewayTab('razorpay')}
              >
                <Smartphone size={13} /> Razorpay
              </button>

              <button
                type="button"
                className={`btn btn-sm ${gatewayTab === 'upi' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                onClick={() => setGatewayTab('upi')}
              >
                <QrCode size={13} /> UPI / QR
              </button>

              <button
                type="button"
                className={`btn btn-sm ${gatewayTab === 'card' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                onClick={() => setGatewayTab('card')}
              >
                <CreditCard size={13} /> Cards
              </button>

              <button
                type="button"
                className={`btn btn-sm ${gatewayTab === 'netbanking' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                onClick={() => setGatewayTab('netbanking')}
              >
                <Building2 size={13} /> NetBank
              </button>
            </div>

            {/* TAB 1: RAZORPAY */}
            {gatewayTab === 'razorpay' && (
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'grid',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary)' }}>
                    Razorpay Standard Checkout
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--emerald-bg)', color: 'var(--emerald-text)', padding: '2px 8px', borderRadius: '99px' }}>
                    Instant Active
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Supports all Indian & International Cards, Google Pay, PhonePe, Paytm, CRED, and Net Banking.
                </p>
                <div style={{
                  background: 'var(--surface)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--border)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}>
                  🔒 Automated Razorpay Signature verification & webhook logging enabled.
                </div>
              </div>
            )}

            {/* TAB 2: UPI / QR CODE */}
            {gatewayTab === 'upi' && (
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '130px',
                  height: '130px',
                  margin: '0 auto 12px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <QrCode size={100} color="#0F172A" />
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Scan with GPay, PhonePe, Paytm, or BHIM
                </div>
                <input
                  type="text"
                  placeholder="Or enter UPI ID (e.g. user@okhdfcbank)"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: '12.5px',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
            )}

            {/* TAB 3: CARDS */}
            {gatewayTab === 'card' && (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        fontSize: '13px',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 4: NET BANKING */}
            {gatewayTab === 'netbanking' && (
              <div style={{ display: 'grid', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700 }}>Choose Popular Bank</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedBank === bank ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: selectedBank === bank ? 'var(--primary-light)' : 'var(--surface)',
                        color: selectedBank === bank ? 'var(--primary)' : 'var(--text-primary)',
                        fontSize: '12px',
                        fontWeight: 700,
                        textAlign: 'left'
                      }}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isProcessing && (
              <div style={{
                marginTop: '18px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <RefreshCw size={16} className="spin" style={{ animation: 'spinOrbitCW 1s linear infinite' }} />
                <span>{processingStep}</span>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Invoicing */}
          <div style={{
            background: 'var(--surface-subtle)',
            padding: '26px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>
                Order Summary ({purchasedBooks.length} items)
              </h4>

              {/* Items List */}
              <div style={{ display: 'grid', gap: '10px', maxHeight: '180px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
                {purchasedBooks.map(book => (
                  <div key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 }}>
                      {book.title}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      ₹{book.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'grid', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Item Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>₹{subtotal}</span>
                </div>



                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Digital Delivery & DRM License</span>
                  <span style={{ color: 'var(--emerald-text)', fontWeight: 700 }}>FREE</span>
                </div>

                <div style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontSize: '18px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)'
                }}>
                  <span>Final Total</span>
                  <span style={{ fontSize: '24px', color: 'var(--primary)' }}>₹{finalTotal}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div style={{ marginTop: '20px' }}>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', gap: '8px' }}
                onClick={handlePayNow}
                disabled={isProcessing}
              >
                <Lock size={16} /> Pay ₹{finalTotal} & Unlock →
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
                Instant delivery to "My Library" upon capture.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
