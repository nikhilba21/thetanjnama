import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति (Privacy Policy)',
  description: 'Tanjnama प्राइवेसी पॉलिसी - Google AdSense और उपयोगकर्ता डेटा सुरक्षा नीतियां।'
};

export default function PrivacyPolicyPage() {
  return (
    <main className="page-container">
      <div className="container" style={{ maxWidth: '800px', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '16px', color: 'var(--dark-bg)' }}>
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>अंतिम अद्यतन: 2026</p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334155', marginBottom: '16px' }}>
          Tanjnama (thetanjnama-omega.vercel.app) पर, हम अपने पाठकों की गोपनीयता का पूरा सम्मान करते हैं। यह प्राइवेसी पॉलिसी दस्तावेज बताती है कि हमारे द्वारा किस प्रकार की जानकारी एकत्र की जाती है और उसका उपयोग कैसे किया जाता है।
        </p>

        <h2 style={{ fontSize: '18px', color: 'var(--primary)', margin: '20px 0 10px' }}>Google AdSense व कुकीज़ (Cookies & Web Beacons)</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569', marginBottom: '16px' }}>
          Tanjnama विज्ञापन प्रदर्शित करने के लिए तृतीय-पक्ष विक्रेताओं, जैसे Google AdSense का उपयोग करता है। Google हमारी साइट या इंटरनेट पर अन्य साइटों की पिछली विज़िट के आधार पर विज्ञापन परोसने के लिए कुकीज़ (DART cookies) का उपयोग करता है।
        </p>

        <h2 style={{ fontSize: '18px', color: 'var(--primary)', margin: '20px 0 10px' }}>लॉग फाइल्स (Log Files)</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569', marginBottom: '16px' }}>
          Tanjnama मानक लॉग फाइलों का उपयोग करता है। इन फाइलों में केवल इंटरनेट प्रोटोकॉल (IP) पते, ब्राउज़र का प्रकार, इंटरनेट सेवा प्रदाता (ISP), दिनांक/समय स्टैम्प और संदर्भित पेज शामिल होते हैं।
        </p>

        <h2 style={{ fontSize: '18px', color: 'var(--primary)', margin: '20px 0 10px' }}>सहमति (Consent)</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569' }}>
          हमारी वेबसाइट का उपयोग करके, आप हमारी गोपनीयता नीति के लिए सहमति देते हैं और इसकी शर्तों से सहमत होते हैं।
        </p>
      </div>
    </main>
  );
}
