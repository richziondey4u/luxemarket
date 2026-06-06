import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using LuxeMarket ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time with notice provided via email or platform notification.`,
  },
  {
    title: '2. Eligibility',
    content: `You must be at least 18 years old to use LuxeMarket. By creating an account, you confirm that:

- You are at least 18 years of age
- You have the legal capacity to enter into a binding contract
- All information you provide is accurate and up to date
- You will not use the platform for any unlawful purpose`,
  },
  {
    title: '3. Account Responsibilities',
    content: `When you create an account:

- You are responsible for maintaining the confidentiality of your password
- You are responsible for all activities that occur under your account
- You must notify us immediately of any unauthorized use
- You may not share your account with others
- We reserve the right to terminate accounts that violate these terms`,
  },
  {
    title: '4. Products and Pricing',
    content: `• All prices are listed in Nigerian Naira (₦) unless otherwise stated
- Prices are subject to change without notice
- Product images are for illustration purposes and may vary slightly from the actual product
- We reserve the right to limit quantities available for purchase
- In the event of a pricing error, we reserve the right to cancel affected orders`,
  },
  {
    title: '5. Orders and Payment',
    content: `• Orders are confirmed only upon successful payment
- We accept payment via Paystack (card, bank transfer, USSD)
- Payment on delivery is available in select areas
- We reserve the right to refuse or cancel any order
- Order cancellations after processing may incur charges`,
  },
  {
    title: '6. Shipping and Delivery',
    content: `• Delivery times are estimates and not guaranteed
- LuxeMarket is not responsible for delays caused by third-party logistics partners
- Risk of loss passes to you upon delivery
- You are responsible for inspecting your order upon delivery and reporting any issues within 48 hours`,
  },
  {
    title: '7. Returns and Refunds',
    content: `• Our 30-day return policy applies to eligible items in original condition
- Refunds are processed to the original payment method within 3–5 business days
- Shipping costs for returns are covered by LuxeMarket for defective items
- Items marked "Final Sale" are not eligible for return
- See our full Return Policy for detailed instructions`,
  },
  {
    title: '8. Intellectual Property',
    content: `All content on LuxeMarket — including logos, text, images, and software — is the property of LuxeMarket or its content suppliers and is protected by Nigerian and international intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit written permission.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `To the maximum extent permitted by Nigerian law, LuxeMarket shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of profits, data, or goodwill. Our total liability shall not exceed the amount paid by you for the specific transaction giving rise to the claim.`,
  },
  {
    title: '10. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.`,
  },
]

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--bg-section)', borderBottom: '1px solid var(--border-light)', padding: 'clamp(36px, 5vw, 64px) 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--brand-mid)', borderRadius: '99px', padding: '5px 14px', marginBottom: '14px' }}>
          <FileText style={{ width: '13px', height: '13px', color: 'var(--brand)' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--brand)', letterSpacing: '0.08em' }}>TERMS & CONDITIONS</span>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Last updated: June 6, 2026</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px 72px' }}>
        <div style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '16px 20px', marginBottom: '28px' }}>
          <p style={{ fontSize: '0.875rem', color: '#a16207', lineHeight: '1.7' }}>
            <strong>Please read these terms carefully.</strong> By using LuxeMarket, you agree to these Terms and Conditions. If you have questions, contact us before proceeding.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SECTIONS.map((section, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '22px 24px', boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>{section.title}</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{section.content}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '28px', backgroundColor: 'var(--bg-section)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Have questions about our terms?
          </p>
          <Link to="/contact" className="btn-primary" style={{ borderRadius: '8px', fontSize: '0.78rem', padding: '8px 20px' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  )
}