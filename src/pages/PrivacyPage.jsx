import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
    
- Personal identification: name, email address, phone number
- Delivery information: shipping address, city, state
- Payment information: processed securely by Paystack (we never store card details)
- Account activity: purchase history, wishlist, reviews
- Device and usage data: IP address, browser type, pages visited`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:
    
- Process your orders and send delivery updates
- Manage your account and provide customer support
- Send promotional emails (you can unsubscribe anytime)
- Improve our platform and personalize your experience
- Detect and prevent fraud and abuse
- Comply with Nigerian Data Protection Regulation (NDPR)`,
  },
  {
    title: '3. Information Sharing',
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:
    
- Delivery partners (only your name and address for order fulfillment)
- Payment processors (Paystack) for secure transaction processing
- Service providers who assist in our operations under strict confidentiality agreements
- Law enforcement when required by Nigerian law`,
  },
  {
    title: '4. Data Security',
    content: `We implement industry-standard security measures to protect your personal information:
    
- All data transmissions are encrypted using TLS/SSL
- Payment information is handled by PCI-DSS compliant Paystack
- We regularly audit our systems for vulnerabilities
- Employee access to personal data is restricted and monitored
- We retain data only as long as necessary`,
  },
  {
    title: '5. Your Rights (NDPR)',
    content: `Under the Nigeria Data Protection Regulation, you have the right to:
    
- Access the personal data we hold about you
- Correct inaccurate or incomplete data
- Request deletion of your personal data
- Object to processing of your data for marketing
- Data portability — receive your data in a portable format
- Withdraw consent at any time

To exercise any of these rights, contact privacy@luxemarket.com`,
  },
  {
    title: '6. Cookies',
    content: `We use cookies and similar technologies to enhance your experience:
    
- Essential cookies: required for the site to function
- Analytics cookies: help us understand how visitors use the site
- Marketing cookies: used to deliver relevant advertisements
    
You can control cookie settings in your browser. Disabling some cookies may affect site functionality.`,
  },
  {
    title: '7. Children\'s Privacy',
    content: `LuxeMarket is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us immediately and we will delete it.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a prominent notice on our website. Your continued use of LuxeMarket after any changes constitutes acceptance of the updated policy.`,
  },
]

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--bg-section)', borderBottom: '1px solid var(--border-light)', padding: 'clamp(36px, 5vw, 64px) 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--brand-mid)', borderRadius: '99px', padding: '5px 14px', marginBottom: '14px' }}>
          <Shield style={{ width: '13px', height: '13px', color: 'var(--brand)' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--brand)', letterSpacing: '0.08em' }}>PRIVACY POLICY</span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Last updated: January 1, 2025</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px 72px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '20px 24px', marginBottom: '32px', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.75' }}>
            LuxeMarket ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information in accordance with the{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Nigeria Data Protection Regulation (NDPR)</strong>.
            By using our platform, you agree to the terms described below.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {SECTIONS.map((section, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>{section.title}</h2>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', backgroundColor: 'var(--bg-section)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Questions about our privacy practices?
          </p>
          <Link to="/contact" className="btn-primary" style={{ borderRadius: '8px', fontSize: '0.78rem', padding: '8px 20px' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  )
}