import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Search, MessageSquare } from 'lucide-react'

const FAQS = {
  'Orders & Delivery': [
    { q: 'How long does delivery take?', a: 'Standard delivery takes 2–5 business days within Lagos and 3–7 days for other states. Express delivery (1–2 days) is available in Lagos and Abuja.' },
    { q: 'How do I track my order?', a: 'Visit our Track Order page and enter your Order ID. You can find your Order ID in the confirmation email or your Account > Orders page.' },
    { q: 'Can I change my delivery address after placing an order?', a: 'Yes, you can change your delivery address within 1 hour of placing your order by contacting our support team immediately.' },
    { q: 'What if my order is delayed?', a: 'If your order hasn\'t arrived within the estimated delivery window, please contact us with your Order ID and we\'ll investigate immediately.' },
    { q: 'Do you deliver outside Nigeria?', a: 'Currently we only deliver within Nigeria. International shipping is coming soon!' },
  ],
  'Payments': [
    { q: 'What payment methods do you accept?', a: 'We accept debit/credit cards, bank transfers, USSD, and mobile money via Paystack. All payments are secured with 256-bit encryption.' },
    { q: 'Is it safe to save my card details?', a: 'We never store your card details on our servers. All payment information is handled securely by Paystack, a PCI-DSS compliant payment processor.' },
    { q: 'Can I pay on delivery?', a: 'Pay on delivery is available in Lagos for orders under ₦50,000. Select "Pay on Delivery" at checkout.' },
    { q: 'Why was my payment declined?', a: 'Payment declines can happen due to insufficient funds, incorrect card details, or bank restrictions. Please check your details or try a different payment method.' },
  ],
  'Returns & Refunds': [
    { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy. Items must be unused, in original packaging, and accompanied by proof of purchase.' },
    { q: 'How do I initiate a return?', a: 'Go to Account > Orders, select the item, and click "Request Return". Our team will arrange a free pickup within 2 business days.' },
    { q: 'When will I receive my refund?', a: 'Refunds are processed within 3–5 business days after we receive the returned item. The money will appear in your original payment method.' },
    { q: 'Are there items I cannot return?', a: 'Perishable goods, opened skincare/beauty products, and items marked "Final Sale" cannot be returned for hygiene and safety reasons.' },
  ],
  'Account & Security': [
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and enter your email address. You\'ll receive a reset link within a few minutes.' },
    { q: 'How do I delete my account?', a: 'Go to Account > Settings > Danger Zone and click "Delete Account". This action is permanent and cannot be undone.' },
    { q: 'Is my personal data safe?', a: 'Absolutely. We follow strict NDPR (Nigeria Data Protection Regulation) guidelines. Read our Privacy Policy for full details.' },
    { q: 'Can I have multiple accounts?', a: 'Each email address can only be used for one account. If you need help merging accounts, contact our support team.' },
  ],
  'Products': [
    { q: 'Are all products genuine?', a: 'Yes, 100%. All our products come from verified suppliers and brands. We have a zero-tolerance policy for counterfeit goods.' },
    { q: 'How do I know if a product is in stock?', a: 'Stock status is shown on each product page. You can enable restock notifications by clicking "Notify Me" on out-of-stock items.' },
    { q: 'Can I leave a product review?', a: 'Yes! After receiving your order, you\'ll receive an email inviting you to leave a review. Reviews can also be added via Account > Orders.' },
    { q: 'What if I receive a damaged item?', a: 'If your item arrives damaged, take photos immediately and contact us within 48 hours. We\'ll send a replacement or issue a full refund.' },
  ],
}

export default function FAQPage() {
  const [openItem,    setOpenItem]    = useState(null)
  const [activeGroup, setActiveGroup] = useState(Object.keys(FAQS)[0])
  const [search,      setSearch]      = useState('')

  const filtered = search.trim()
    ? Object.entries(FAQS).flatMap(([group, items]) =>
        items.filter(item =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
        ).map(item => ({ ...item, group }))
      )
    : FAQS[activeGroup]

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ backgroundColor: 'var(--bg-section)', borderBottom: '1px solid var(--border-light)', padding: 'clamp(40px, 6vw, 72px) 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--brand-mid)', borderRadius: '99px', padding: '5px 14px', marginBottom: '16px' }}>
          <MessageSquare style={{ width: '13px', height: '13px', color: 'var(--brand)' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--brand)', letterSpacing: '0.08em' }}>FAQ</span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
          Can't find what you're looking for? Our team is always happy to help.
        </p>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-subtle)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="input-field"
            style={{ paddingLeft: '42px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 16px 72px' }}>
        {!search && (
          /* Category tabs */
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {Object.keys(FAQS).map(group => (
              <button key={group} onClick={() => setActiveGroup(group)} style={{
                padding: '7px 16px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '600',
                border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: activeGroup === group ? 'var(--brand)' : 'var(--bg-card)',
                borderColor:     activeGroup === group ? 'var(--brand)' : 'var(--border-medium)',
                color:           activeGroup === group ? '#fff' : 'var(--text-secondary)',
              }}>
                {group}
              </button>
            ))}
          </div>
        )}

        {search && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </p>
        )}

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>No questions match your search.</p>
              <button onClick={() => setSearch('')} className="btn-outline" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>Clear Search</button>
            </div>
          ) : (
            filtered.map((item, i) => {
              const key   = (item.group || activeGroup) + '_' + i
              const isOpen = openItem === key
              return (
                <div key={key} style={{
                  backgroundColor: 'var(--bg-card)', border: '1px solid',
                  borderColor: isOpen ? 'var(--brand-mid)' : 'var(--border-light)',
                  borderRadius: '12px', overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)', transition: 'border-color 0.2s',
                }}>
                  <button
                    onClick={() => setOpenItem(isOpen ? null : key)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', background: 'none', border: 'none',
                      cursor: 'pointer', gap: '12px', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                      {item.q}
                    </span>
                    <ChevronDown style={{
                      width: '18px', height: '18px', color: 'var(--text-muted)',
                      flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s',
                    }} />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', borderTop: '1px solid var(--border-light)' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.75', paddingTop: '14px' }}>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Still need help */}
        <div style={{ marginTop: '48px', backgroundColor: 'var(--bg-section)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Still need help?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>Our support team is available Mon–Fri, 8am–6pm WAT</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ borderRadius: '8px', fontSize: '0.78rem', padding: '8px 20px' }}>Contact Support</Link>
            <a href="tel:+2348039830412" className="btn-secondary" style={{ borderRadius: '8px', fontSize: '0.78rem', padding: '8px 20px' }}>Call Us</a>
          </div>
        </div>
      </div>
    </div>
  )
}