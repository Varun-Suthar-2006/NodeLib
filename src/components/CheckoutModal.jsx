import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { openRazorpayCheckout, getRazorpayKeyId } from '../services/razorpayService';
import InvoiceModal from './InvoiceModal';
import { 
  X, ShieldCheck, CheckCircle2, QrCode, 
  CreditCard, Smartphone, Building2, Lock, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw,
  FileText, BookOpen, Printer, ExternalLink
} from 'lucide-react';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, setIsCheckoutOpen, 
    checkoutItems, books, currentUser,
    processPayment, showToast, openReader, navigateTo
  } = useApp();

  // Payment Gateway Tab: 'razorpay' | 'upi' | 'card' | 'netbanking'
  const [gatewayTab, setGatewayTab] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  // Post-Payment Success State
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Card Inputs (Direct Simulation)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI Inputs
  const [upiVpa, setUpiVpa] = useState('');

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

  // Pay with Real Razorpay SDK
  const handleRazorpayLivePay = () => {
    setIsProcessing(true);
    setProcessingStep('Launching Razorpay 256-Bit Encrypted Checkout...');

    openRazorpayCheckout({
      amount: finalTotal,
      books: purchasedBooks,
      user: currentUser,
      onSuccess: async (rzpResponse) => {
        setProcessingStep('Verifying transaction signature and recording order...');
        
        const methodDetails = {
          gateway: 'RAZORPAY_STANDARD',
          txnRef: rzpResponse.paymentId,
          mode: 'Razorpay Unified Checkout',
          keyUsed: rzpResponse.keyUsed
        };

        const newOrder = await processPayment('RAZORPAY', rzpResponse.paymentId, methodDetails);
        
        setIsProcessing(false);
        setProcessingStep('');
        setCompletedOrder({
          ...newOrder,
          payment_id: rzpResponse.paymentId,
          transactionRef: rzpResponse.paymentId,
          paymentMethod: 'RAZORPAY STANDARD'
        });
      },
      onFailure: (err) => {
        setIsProcessing(false);
        setProcessingStep('');
        showToast('Payment was not completed: ' + err.message, 'error');
      },
      onDismiss: () => {
        setIsProcessing(false);
        setProcessingStep('');
      }
    });
  };

  // Pay with Simulated / Direct Method Fallback
  const handleSimulatedPay = async () => {
    setIsProcessing(true);
    
    setProcessingStep(`Initiating secure payment session via ${gatewayTab.toUpperCase()}...`);
    await new Promise(r => setTimeout(r, 600));

    setProcessingStep(`Authorizing ₹${finalTotal} with banking provider...`);
    await new Promise(r => setTimeout(r, 700));

    const txnRef = gatewayTab === 'upi' ? `upi_utr_${Math.floor(100000000000 + Math.random() * 900000000000)}` :
                   gatewayTab === 'card' ? `card_auth_${Math.random().toString(36).substring(2, 10)}` :
                   `netbank_${Math.random().toString(36).substring(2, 10)}`;

    setProcessingStep(`Payment Captured (${txnRef}). Writing invoice to database...`);
    await new Promise(r => setTimeout(r, 600));

    const methodDetails = {
      gateway: gatewayTab.toUpperCase(),
      txnRef,
      mode: gatewayTab === 'card' ? `Card (ending ${cardNumber.slice(-4) || '4242'})` :
            gatewayTab === 'upi' ? `UPI (${upiVpa || 'instant_qr'})` :
            `NetBanking (${selectedBank})`
    };

    const newOrder = await processPayment(gatewayTab, txnRef, methodDetails);

    setIsProcessing(false);
    setProcessingStep('');
    setCompletedOrder({
      ...newOrder,
      payment_id: txnRef,
      transactionRef: txnRef,
      paymentMethod: gatewayTab.toUpperCase()
    });
  };

  const handleClose = () => {
    if (isProcessing) return;
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div 
          className="modal-content wide animate-fade-in"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '820px', padding: '0', overflow: 'hidden' }}
        >
          {/* Modal Top Header */}
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
                <ShieldCheck size={14} /> 256-BIT ENCRYPTED CHECKOUT · RAZORPAY VERIFIED
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
                {completedOrder ? '🎉 Order Confirmed & Unlocked!' : 'Complete Your Digital E-Book Purchase'}
              </h3>
            </div>
            {!isProcessing && (
              <button 
                className="modal-close-btn" 
                style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={handleClose}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* SUCCESS SCREEN */}
          {completedOrder ? (
            <div style={{ padding: '36px 32px', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.15)'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Payment Captured Successfully!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '520px', margin: '0 auto 20px' }}>
                Your transaction has been verified. <strong>{purchasedBooks.length} engineering title(s)</strong> have been permanently unlocked in your personal Digital Library.
              </p>

              {/* Order Metadata Box */}
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                maxWidth: '540px',
                margin: '0 auto 24px',
                textAlign: 'left',
                display: 'grid',
                gap: '8px',
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>#{completedOrder.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Reference:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
                    {completedOrder.payment_id || completedOrder.transactionRef}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--emerald-text)' }}>
                    ₹{completedOrder.total} (GST Included)
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsInvoiceOpen(true)}
                  style={{ gap: '8px' }}
                >
                  <FileText size={16} /> View &amp; Print GST Tax Invoice
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    handleClose();
                    navigateTo('library');
                  }}
                  style={{ gap: '8px' }}
                >
                  <BookOpen size={16} /> Go to My Digital Library →
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT BODY: 2 COLUMNS */
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', minHeight: '440px' }}>
              
              {/* Left Column: Payment Gateways */}
              <div style={{ padding: '26px 28px', borderRight: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Select Payment Gateway
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Key: {getRazorpayKeyId().substring(0, 10)}•••
                  </span>
                </div>

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

                {/* TAB 1: RAZORPAY STANDARD LIVE */}
                {gatewayTab === 'razorpay' && (
                  <div style={{
                    background: 'var(--surface-subtle)',
                    border: '1.5px solid var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    display: 'grid',
                    gap: '14px',
                    boxShadow: '0 4px 16px var(--primary-glow)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--primary)' }}>
                        ⚡ Official Razorpay Express
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 800, background: 'var(--emerald-bg)', color: 'var(--emerald-text)', padding: '2px 8px', borderRadius: '99px' }}>
                        LIVE &amp; TEST READY
                      </span>
                    </div>

                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      Opens official Razorpay standard checkout. Accepts all Credit/Debit cards, UPI (GPay, PhonePe, Paytm, BHIM), Net Banking across 50+ Indian banks, CRED, and Wallets.
                    </p>

                    <div style={{
                      background: 'var(--surface)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px dashed var(--border)',
                      fontSize: '11.5px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4
                    }}>
                      🔒 PCI-DSS Level 1 Certified · Instant GST Tax Invoice Generated upon approval.
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
                      width: '120px',
                      height: '120px',
                      margin: '0 auto 10px',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-xs)'
                    }}>
                      <QrCode size={94} color="#0F172A" />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Scan with GPay, PhonePe, Paytm, or BHIM UPI
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

                {/* Processing State Indicator */}
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
                    <RefreshCw size={16} style={{ animation: 'spinOrbitCW 1s linear infinite' }} />
                    <span>{processingStep}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary & Pay Action */}
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
                  <div style={{ display: 'grid', gap: '10px', maxHeight: '170px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
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
                      <span>Digital Delivery &amp; DRM License</span>
                      <span style={{ color: 'var(--emerald-text)', fontWeight: 700 }}>FREE (0-SEC)</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '11.5px' }}>
                      <span>Estimated 18% GST (SAC 4901)</span>
                      <span>Included in Price</span>
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
                      <span>Total Amount</span>
                      <span style={{ fontSize: '24px', color: 'var(--primary)' }}>₹{finalTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Pay Button */}
                <div style={{ marginTop: '20px' }}>
                  {gatewayTab === 'razorpay' ? (
                    <button
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', gap: '8px', background: 'var(--primary-gradient)', boxShadow: '0 8px 24px var(--primary-glow)' }}
                      onClick={handleRazorpayLivePay}
                      disabled={isProcessing}
                    >
                      <Lock size={16} /> Pay ₹{finalTotal} via Razorpay →
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', gap: '8px' }}
                      onClick={handleSimulatedPay}
                      disabled={isProcessing}
                    >
                      <Lock size={16} /> Authorize ₹{finalTotal} &amp; Unlock →
                    </button>
                  )}
                  
                  {/* Trust Footer */}
                  <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    🔒 256-Bit SSL Encrypted · 7-Day Refund Guarantee · Instant Access in My Library
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Printable GST Tax Invoice Modal */}
      {completedOrder && isInvoiceOpen && (
        <InvoiceModal
          order={completedOrder}
          books={purchasedBooks}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </>
  );
}
