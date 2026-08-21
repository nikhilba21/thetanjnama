import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'संपर्क करें (Contact Us)',
  description: 'Tanjnama टीम से संपर्क करें। संपादकीय प्रश्न, समाचार सुझाव या विज्ञापन सहायता।'
};

export default function ContactPage() {
  return (
    <main className="page-container">
      <div className="container" style={{ maxWidth: '800px', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '16px', color: 'var(--dark-bg)' }}>
          संपर्क करें (Contact Us)
        </h1>

        <p style={{ fontSize: '15px', color: '#475569', marginBottom: '30px' }}>
          यदि आपके पास कोई समाचार सुझाव, संपादकीय प्रश्न, प्रतिक्रिया या विज्ञापन संबंधी पूछताछ है, तो कृपया नीचे दिए गए माध्यमों से हमसे संपर्क करें:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '8px' }}>📬 संपादकीय एवं समाचार हेतु</h3>
            <p style={{ fontSize: '14px', color: '#334155' }}>Email: editor@thetanjnama.com</p>
            <p style={{ fontSize: '14px', color: '#334155' }}>Press Release: news@thetanjnama.com</p>
          </div>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--primary)', marginBottom: '8px' }}>💼 विज्ञापन व बिजनेस inquiries</h3>
            <p style={{ fontSize: '14px', color: '#334155' }}>AdSense & Ads: ads@thetanjnama.com</p>
            <p style={{ fontSize: '14px', color: '#334155' }}>Location: Rajasthan, India</p>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="आपका नाम (Your Name)" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
          <input type="email" placeholder="ईमेल आईडी (Your Email)" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
          <textarea rows={5} placeholder="आपका संदेश (Your Message)" style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px' }} required />
          <button type="submit" className="btn-primary">संदेश भेजें (Send Message)</button>
        </form>
      </div>
    </main>
  );
}
