import type { Metadata } from 'next';
import Link from 'next/link';
import AajKaSawalWidget from '@/components/AajKaSawalWidget';
import SocialShareBar from '@/components/SocialShareBar';

export const metadata: Metadata = {
  title: 'आज का सवाल — TANJNAMA जनमत मंच | अपनी राय दर्ज करें',
  description:
    'TANJNAMA (तंजनामा) आज का सवाल — समसामयिक, जनहित एवं महत्वपूर्ण मुद्दों पर अपनी निष्पक्ष राय दर्ज करें। लाइव परिणाम और जनता की आवाज।',
  alternates: {
    canonical: 'https://www.tanjnama.com/aaj-ka-sawal'
  },
  openGraph: {
    title: 'आज का सवाल — TANJNAMA जनमत मंच',
    description: 'आज का सवाल: अपनी राय दर्ज करें और लाइव परिणाम देखें।',
    url: 'https://www.tanjnama.com/aaj-ka-sawal'
  }
};

export default function AajKaSawalPage() {
  const shareUrl = 'https://www.tanjnama.com/aaj-ka-sawal';

  return (
    <main className="page-container" style={{ background: '#f8fafc', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* BREADCRUMB */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            होम
          </Link>{' '}
          / <span>आज का सवाल (Daily Poll)</span>
        </div>

        {/* HERO BANNER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #d31018 0%, #991b1b 100%)',
            color: '#ffffff',
            padding: '30px 28px',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(211, 16, 24, 0.2)',
            marginBottom: '24px'
          }}
        >
          <span
            style={{
              background: '#ffffff',
              color: '#d31018',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            जनमत मंच (Public Voice)
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 900, marginTop: '10px', marginBottom: '6px' }}>
            आज का सवाल — TANJNAMA
          </h1>
          <p style={{ fontSize: '15px', color: '#fecaca', margin: 0 }}>
            सवाल हमारा, आवाज आपकी। महत्वपूर्ण सामाजिक एवं जनहित विषय पर अपनी राय दर्ज करें।
          </p>
        </div>

        {/* SOCIAL SHARE BAR AT TOP */}
        <SocialShareBar
          title="आज का सवाल — TANJNAMA जनमत मंच पर अपनी राय दें"
          url={shareUrl}
          subtext="आज के महत्वपूर्ण मुद्दे पर आपकी क्या राय है? नीचे दिए गए लिंक पर क्लिक करके वोट करें और परिणाम देखें:"
        />

        {/* MAIN INTERACTIVE POLL WIDGET */}
        <div style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <AajKaSawalWidget />
        </div>

        {/* BOTTOM SHARE REMINDER */}
        <div style={{ textAlign: 'center', marginTop: '30px', color: '#64748b', fontSize: '14px' }}>
          <p>
            इस सवाल को अपने दोस्तों और व्हाट्सएप ग्रुप्स में शेयर करें ताकि अधिक से अधिक लोग अपनी राय दर्ज कर सकें!
          </p>
        </div>
      </div>
    </main>
  );
}
