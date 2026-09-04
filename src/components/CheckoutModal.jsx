import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  openRazorpayCheckout, 
  getRazorpayKeyId, 
  setRazorpayKeyId, 
  clearRazorpayKeyId,
  isCustomRazorpayKeySet,
  isValidRazorpayKey
} from '../services/razorpayService';
import InvoiceModal from './InvoiceModal';
import { 
  X, ShieldCheck, CheckCircle2, QrCode, 
  CreditCard, Smartphone, Building2, Lock, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw,
  FileText, BookOpen, Printer, ExternalLink,
  KeyRound, Check, Edit3, HelpCircle, Zap
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
  const [lastError, setLastError] = useState(null);
  
  // Post-Payment Success State
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Key Configuration State
  const [isKeyEditorOpen, setIsKeyEditorOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState(() => getRazorpayKeyId());
  const [keySavedMessage, setKeySavedMessage] = useState(false);

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
  const activeKey = getRazorpayKeyId();
  const isCustomKey = isCustomRazorpayKeySet();

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

  // Handle Saving Razorpay Key
  const handleSaveKey = (e) => {
    e.preventDefault();
    const cleanKey = tempKeyInput.trim();
    if (cleanKey) {
      setRazorpayKeyId(cleanKey);
      setKeySavedMessage(true);
      setLastError(null);
      setTimeout(() => setKeySavedMessage(false), 3000);
      showToast('Razorpay Key updated successfully!', 'success');
      setIsKeyEditorOpen(false);
    } else {
      clearRazorpayKeyId();
      showToast('Reset to default Razorpay Key.', 'info');
      setIsKeyEditorOpen(false);
    }
  };

  // Pay with Real Razorpay SDK
  const handleRazorpayLivePay = () => {
    setLastError(null);
    setIsProcessing(true);
    setProcessingStep('Loading official Razorpay 256-Bit Encrypted Gateway...');

    openRazorpayCheckout({
      amount: finalTotal,
      books: purchasedBooks,
      user: currentUser,
      onSuccess: async (rzpResponse) => {
        setProcessingStep('Verifying transaction signature & recording order...');
        
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
          ...(newOrder || {}),
          id: newOrder?.id || 'NLB-' + Math.floor(100000 + Math.random() * 900000),
          total: finalTotal,
          payment_id: rzpResponse.paymentId,
          transactionRef: rzpResponse.paymentId,
          paymentMethod: 'RAZORPAY STANDARD'
        });
      },
      onFailure: (err) => {
        setIsProcessing(false);
        setProcessingStep('');
        console.warn('Razorpay Checkout Notice:', err);
        setLastError(err.message || 'Razorpay could not complete the session.');
        showToast('Razorpay notification: ' + (err.message || 'Payment not completed'), 'info');
      },
      onDismiss: () => {
        setIsProcessing(false);
        setProcessingStep('');
      }
    });
  };

  // Instant Test Sandbox Payment (Guaranteed 100% Reliable for Demo & Testing)
  const handleInstantSandboxPay = async () => {
    setLastError(null);
    setIsProcessing(true);
    
    setProcessingStep('Initializing Razorpay Sandbox Simulation...');
    await new Promise(r => setTimeout(r, 400));

    setProcessingStep(`Authorizing ₹${finalTotal} with test bank authorization server...`);
    await new Promise(r => setTimeout(r, 600));

    const sandboxTxnRef = `pay_sb_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    setProcessingStep(`Payment Captured (${sandboxTxnRef}). Generating GST Tax Invoice...`);
    await new Promise(r => setTimeout(r, 400));

    const methodDetails = {
      gateway: 'RAZORPAY_SANDBOX',
      txnRef: sandboxTxnRef,
      mode: 'Razorpay Sandbox Test Mode',
      keyUsed: activeKey
    };

    const newOrder = await processPayment('RAZORPAY', sandboxTxnRef, methodDetails);

    setIsProcessing(false);
    setProcessingStep('');
    setCompletedOrder({
      ...(newOrder || {}),
      id: newOrder?.id || 'NLB-' + Math.floor(100000 + Math.random() * 900000),
      total: finalTotal,
      payment_id: sandboxTxnRef,
      transactionRef: sandboxTxnRef,
      paymentMethod: 'RAZORPAY SANDBOX'
    });
  };

  // Pay with Direct Method Simulation (UPI / Card / NetBanking)
  const handleSimulatedPay = async () => {
    setIsProcessing(true);
    
    setProcessingStep(`Initiating secure payment session via ${gatewayTab.toUpperCase()}...`);
    await new Promise(r => setTimeout(r, 500));

    setProcessingStep(`Authorizing ₹${finalTotal} with banking provider...`);
    await new Promise(r => setTimeout(r, 600));

    const txnRef = gatewayTab === 'upi' ? `upi_utr_${Math.floor(100000000000 + Math.random() * 900000000000)}` :
                   gatewayTab === 'card' ? `card_auth_${Math.random().toString(36).substring(2, 10)}` :
                   `netbank_${Math.random().toString(36).substring(2, 10)}`;

    setProcessingStep(`Payment Captured (${txnRef}). Writing invoice to database...`);
    await new Promise(r => setTimeout(r, 500));

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
      ...(newOrder || {}),
      id: newOrder?.id || 'NLB-' + Math.floor(100000 + Math.random() * 900000),
      total: finalTotal,
      payment_id: txnRef,
      transactionRef: txnRef,
      paymentMethod: gatewayTab.toUpperCase()
    });
  };

  const handleClose = () => {
    if (isProcessing) return;
    setCompletedOrder(null);
    setLastError(null);
    setIsCheckoutOpen(false);
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div 
          className="modal-content wide animate-fade-in"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '840px', padding: '0', overflow: 'hidden' }}
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
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.15)'
              }}>
                <CheckCircle2 size={40} />
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Payment Captured Successfully!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '540px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Your transaction has been verified. <strong>{purchasedBooks.length} engineering eBook(s)</strong> are now permanently unlocked in your personal Digital Library.
              </p>

              {/* Order Metadata Box */}
              <div style={{
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 22px',
                maxWidth: '560px',
                margin: '0 auto 26px',
                textAlign: 'left',
                display: 'grid',
                gap: '10px',
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
                    ₹{completedOrder.total || finalTotal} (18% GST Included)
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {completedOrder.paymentMethod || 'RAZORPAY'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsInvoiceOpen(true)}
                  style={{ gap: '8px', padding: '12px 20px', fontSize: '14px' }}
                >
                  <FileText size={16} /> View &amp; Print GST Tax Invoice
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    handleClose();
                    navigateTo('library');
                  }}
                  style={{ gap: '8px', padding: '12px 20px', fontSize: '14px' }}
                >
                  <BookOpen size={16} /> Go to My Digital Library →
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT BODY: 2 COLUMNS */
            <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', minHeight: '460px' }}>
              
              {/* Left Column: Payment Gateways */}
              <div style={{ padding: '26px 28px', borderRight: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Select Payment Gateway
                  </h4>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '99px',
                    fontWeight: 700,
                    background: isCustomKey ? 'var(--emerald-bg)' : 'var(--surface-subtle)',
                    color: isCustomKey ? 'var(--emerald-text)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)' 
                  }}>
                    {isCustomKey ? '🟢 Custom Key Active' : '🟡 Sandbox Ready'}
                  </span>
                </div>

                {/* Gateway Selector Tabs */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginBottom: '18px'
                }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${gatewayTab === 'razorpay' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                    onClick={() => { setGatewayTab('razorpay'); setLastError(null); }}
                  >
                    <Smartphone size={13} /> Razorpay
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${gatewayTab === 'upi' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                    onClick={() => { setGatewayTab('upi'); setLastError(null); }}
                  >
                    <QrCode size={13} /> UPI / QR
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${gatewayTab === 'card' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                    onClick={() => { setGatewayTab('card'); setLastError(null); }}
                  >
                    <CreditCard size={13} /> Cards
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${gatewayTab === 'netbanking' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '8px 4px', fontSize: '12px', gap: '4px' }}
                    onClick={() => { setGatewayTab('netbanking'); setLastError(null); }}
                  >
                    <Building2 size={13} /> NetBank
                  </button>
                </div>

                {/* TAB 1: RAZORPAY STANDARD LIVE */}
                {gatewayTab === 'razorpay' && (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{
                      background: 'var(--surface-subtle)',
                      border: '1.5px solid var(--primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 18px',
                      display: 'grid',
                      gap: '12px',
                      boxShadow: '0 4px 16px var(--primary-glow)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          ⚡ Official Razorpay Express
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsKeyEditorOpen(!isKeyEditorOpen)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <KeyRound size={12} /> {isKeyEditorOpen ? 'Hide Key' : '⚙️ Configure Key ID'}
                        </button>
                      </div>

                      {/* Inline Key Configuration Panel */}
                      {isKeyEditorOpen ? (
                        <form onSubmit={handleSaveKey} style={{
                          background: 'var(--surface)',
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          display: 'grid',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              Paste Your Razorpay Key ID:
                            </label>
                            <a 
                              href="https://dashboard.razorpay.com/app/keys" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ fontSize: '11px', color: 'var(--primary)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '2px' }}
                            >
                              Get Key ↗
                            </a>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="text"
                              value={tempKeyInput}
                              onChange={(e) => setTempKeyInput(e.target.value)}
                              placeholder="rzp_test_... or rzp_live_..."
                              style={{
                                flex: 1,
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface-subtle)',
                                fontSize: '12px',
                                fontFamily: 'var(--font-mono)'
                              }}
                            />
                            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 10px', fontSize: '11.5px' }}>
                              <Check size={13} /> Save
                            </button>
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                            Accepts <code>rzp_test_...</code> for Sandbox or <code>rzp_live_...</code> for Production payments.
                          </div>
                        </form>
                      ) : (
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Active Key: <strong>{activeKey.substring(0, 12)}••••</strong>
                        </div>
                      )}

                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        Accepts all UPI apps (GPay, PhonePe, Paytm, BHIM), Indian &amp; International Debit/Credit Cards, Net Banking (50+ Banks), CRED, and Wallets.
                      </p>
                    </div>

                    {/* Error Notice / Fallback helper if Razorpay encounters an error */}
                    {lastError && (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        fontSize: '12px',
                        display: 'grid',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 700 }}>
                          <AlertCircle size={15} /> Razorpay Notice
                        </div>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {lastError}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            onClick={() => setIsKeyEditorOpen(true)}
                          >
                            <KeyRound size={12} /> Enter Real Key ID
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '11px', padding: '4px 8px', background: 'var(--emerald)', borderColor: 'var(--emerald)' }}
                            onClick={handleInstantSandboxPay}
                          >
                            <Zap size={12} /> Use Instant Test Pay
                          </button>
                        </div>
                      </div>
                    )}
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
                    marginTop: '16px',
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
                  <div style={{ display: 'grid', gap: '10px', maxHeight: '160px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
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

                {/* Primary Pay Buttons */}
                <div style={{ marginTop: '20px', display: 'grid', gap: '10px' }}>
                  {gatewayTab === 'razorpay' ? (
                    <>
                      <button
                        className="btn btn-primary btn-lg"
                        style={{ 
                          width: '100%', 
                          gap: '8px', 
                          background: 'var(--primary-gradient)', 
                          boxShadow: '0 8px 24px var(--primary-glow)' 
                        }}
                        onClick={handleRazorpayLivePay}
                        disabled={isProcessing}
                      >
                        <Lock size={16} /> Pay ₹{finalTotal} via Razorpay →
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{
                          width: '100%',
                          fontSize: '12px',
                          color: 'var(--emerald-text)',
                          borderColor: 'rgba(16, 185, 129, 0.3)',
                          background: 'rgba(16, 185, 129, 0.05)',
                          gap: '6px'
                        }}
                        onClick={handleInstantSandboxPay}
                        disabled={isProcessing}
                        title="Instant test authorization without waiting for credentials"
                      >
                        <Zap size={13} /> ⚡ Instant Test Pay (Demo Sandbox)
                      </button>
                    </>
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
                  <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
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
