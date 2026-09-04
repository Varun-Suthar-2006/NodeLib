import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, RefreshCw, Truck, Lock, 
  FileText, CheckCircle2, ArrowRight, BookOpen, AlertCircle 
} from 'lucide-react';

export function TermsView() {
  const { navigateTo } = useApp();

  return (
    <div className="wrap view-enter" style={{ padding: '40px 0 80px', maxWidth: '820px' }}>
      <div className="section-kicker" style={{ color: 'var(--primary)' }}>LEGAL &amp; COMPLIANCE</div>
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px' }}>
        Last Updated: September 4, 2026 · Effective for all customers of NodeLib by Lotus &amp; Lithium Technologies
      </p>

      <div className="policy-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'grid', gap: '28px', lineHeight: 1.7, fontSize: '14.5px', color: 'var(--text-secondary)' }}>
        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            1. Agreement to Terms
          </h3>
          <p>
            By accessing or purchasing digital content from NodeLib (operated by Lotus &amp; Lithium Technologies), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services or digital repository.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            2. Digital Content Licensing &amp; DRM-Free Usage
          </h3>
          <p>
            All e-books, architectural manuscripts, and code repositories purchased on NodeLib are licensed to you for personal and professional educational use. While our digital downloads are DRM-free for customer convenience, you agree not to redistribute, resell, re-license, or upload our publications to public torrent or file-sharing networks.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            3. Pricing &amp; Commercial Transactions
          </h3>
          <p>
            All prices listed on NodeLib are in Indian Rupees (INR) and inclusive of applicable Goods and Services Tax (GST SAC 4901). NodeLib utilizes authorized RBI-compliant payment aggregators including Razorpay to securely process debit/credit cards, UPI, and NetBanking transactions.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            4. User Accounts &amp; Digital Shelf Access
          </h3>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You retain perpetual access to all purchased titles in your personal Digital Library under your registered email account.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            5. Limitation of Liability &amp; Code Samples
          </h3>
          <p>
            The architectural patterns, scripts, and code samples provided in our technical manuscripts are for educational purposes. Lotus &amp; Lithium Technologies shall not be held liable for direct or consequential damages resulting from production implementation of concepts described in our literature.
          </p>
        </section>
      </div>
    </div>
  );
}

export function PrivacyView() {
  return (
    <div className="wrap view-enter" style={{ padding: '40px 0 80px', maxWidth: '820px' }}>
      <div className="section-kicker" style={{ color: 'var(--primary)' }}>DATA PROTECTION &amp; GDPR</div>
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px' }}>
        Compliant with the Information Technology Act, 2000 and Digital Personal Data Protection (DPDP) Act
      </p>

      <div className="policy-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'grid', gap: '28px', lineHeight: 1.7, fontSize: '14.5px', color: 'var(--text-secondary)' }}>
        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            1. Information We Collect
          </h3>
          <p>
            We collect personal information necessary to deliver and sync your e-book purchases:
          </p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'grid', gap: '6px' }}>
            <li>Name and Email Address (for account authentication and order tax invoices)</li>
            <li>Purchase History and Digital Shelf synchronization data</li>
            <li>Technical device logs and reading progression metrics (stored locally/encrypted)</li>
          </ul>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            2. Zero Raw Financial Data Retention
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--emerald-bg)', color: 'var(--emerald-text)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontWeight: 700, marginBottom: '12px' }}>
            <ShieldCheck size={20} />
            <span>PCI-DSS Level 1 Compliant 256-Bit SSL Payment Processing</span>
          </div>
          <p>
            NodeLib does NOT store, capture, or log your credit card numbers, CVVs, or UPI PINs. All payment authorizations are executed directly on Razorpay's banking-grade encrypted infrastructure.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            3. Third-Party Services
          </h3>
          <p>
            We only share minimal customer data with authorized infrastructure providers:
          </p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'grid', gap: '6px' }}>
            <li><strong>Razorpay:</strong> Encrypted transaction processing and fraud detection</li>
            <li><strong>Supabase:</strong> Encrypted PostgreSQL database for digital bookshelf sync</li>
          </ul>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            4. Data Retention &amp; Customer Rights
          </h3>
          <p>
            You have the right to request a copy of your stored purchase history or request permanent deletion of your account by contacting our Data Protection Officer at privacy@nodelib.example.
          </p>
        </section>
      </div>
    </div>
  );
}

export function RefundPolicyView() {
  return (
    <div className="wrap view-enter" style={{ padding: '40px 0 80px', maxWidth: '820px' }}>
      <div className="section-kicker" style={{ color: 'var(--primary)' }}>CUSTOMER GUARANTEE</div>
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
        Refund &amp; Cancellation Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px' }}>
        Fair and transparent refund policy for digital engineering publications
      </p>

      <div className="policy-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'grid', gap: '28px', lineHeight: 1.7, fontSize: '14.5px', color: 'var(--text-secondary)' }}>
        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            1. Digital Product Nature
          </h3>
          <p>
            Because NodeLib provides instant digital delivery of downloadable DRM-free e-books (PDF and ePub formats), digital products once accessed or downloaded are generally non-tangible irrevocable goods.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            2. 7-Day Guarantee for Defective or Corrupted Files
          </h3>
          <p>
            If you encounter any of the following issues within <strong>7 days of purchase</strong>, you are entitled to a full, unconditional refund or replacement file:
          </p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'grid', gap: '6px' }}>
            <li>Corrupted, incomplete, or unreadable PDF / ePub files that cannot be resolved by re-downloading</li>
            <li>Accidental duplicate payments or double charges for the same title</li>
            <li>Significant disparity between advertised chapter contents and delivered material</li>
          </ul>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            3. Refund Process &amp; Timeline
          </h3>
          <p>
            To initiate a refund request, simply email <strong>refunds@nodelib.example</strong> with your Order ID and payment transaction reference.
          </p>
          <p style={{ marginTop: '8px' }}>
            Approved refunds are credited back to your original payment method (Credit/Debit Card, UPI, or NetBanking account) within <strong>5 to 7 working business days</strong> via Razorpay.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            4. Order Cancellation
          </h3>
          <p>
            Since access to the digital manuscript is provisioned instantaneously at the moment payment is captured, orders cannot be cancelled between authorization and delivery. If you placed an order by error, submit a ticket within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}

export function ShippingPolicyView() {
  return (
    <div className="wrap view-enter" style={{ padding: '40px 0 80px', maxWidth: '820px' }}>
      <div className="section-kicker" style={{ color: 'var(--primary)' }}>DELIVERY STANDARDS</div>
      <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
        Instant Digital Delivery Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '32px' }}>
        0-Second digital fulfillment for all NodeLib engineering publications
      </p>

      <div className="policy-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px', display: 'grid', gap: '28px', lineHeight: 1.7, fontSize: '14.5px', color: 'var(--text-secondary)' }}>
        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            1. Zero Physical Shipping / 100% Digital Delivery
          </h3>
          <p>
            NodeLib exclusively publishes digital technical e-books, architectural manuscripts, and accompanying source repositories. There are no physical shipping charges, customs duties, or postal delivery delays.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            2. Instant Automated Fulfillment Timeline
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontWeight: 700, marginBottom: '12px' }}>
            <CheckCircle2 size={20} />
            <span>Instant 0-Second Delivery: Unlocked in "My Digital Library" immediately</span>
          </div>
          <p>
            Upon successful transaction verification by Razorpay:
          </p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'grid', gap: '6px' }}>
            <li>The title is immediately activated in your personal <strong>My Library</strong> view</li>
            <li>Direct DRM-free PDF / ePub reading links become active in the web reader</li>
            <li>An official GST Tax Invoice receipt is generated and emailed to your registered address</li>
          </ul>
        </section>

        <section>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            3. Delivery Support
          </h3>
          <p>
            If you do not see your purchased title in your library after a successful payment capture, please refresh your browser or contact <strong>support@nodelib.example</strong> with your Razorpay Payment ID (`pay_xxx`). Our automated reconciliation service runs 24/7.
          </p>
        </section>
      </div>
    </div>
  );
}
