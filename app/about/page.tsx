import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'हमारे बारे में (About Us)',
  description: 'Tanjnama (तंजनामा) — खबरों, तंज, विश्लेषण और स्वतंत्र नागरिक पत्रकारिता का डिजिटल मंच।'
};

export default function AboutPage() {
  return (
    <main className="page-container">
      <div className="container" style={{ maxWidth: '800px', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '16px', color: 'var(--dark-bg)' }}>
          हमारे बारे में (About Tanjnama)
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#334155', marginBottom: '20px' }}>
          <strong>Tanjnama (तंजनामा)</strong> खबरों के बीच से निकला हुआ तीखा तंज, निष्पक्ष विश्लेषण और स्वतंत्र डिजिटल समाचार का एक अनोखा मंच है। हमारी स्थापना का मुख्य उद्देश्य पाठकों तक केवल मुख्यधारा की सुर्खियां ही नहीं, बल्कि उन खबरों के पीछे छुपे सच, विडंबनाओं और वास्तविक सामाजिक-राजनीतिक प्रभाव को पहुँचाना है।
        </p>

        <h2 style={{ fontSize: '20px', margin: '24px 0 12px', color: 'var(--primary)' }}>हमारा विजन (Our Vision)</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#475569', marginBottom: '20px' }}>
          लोकतंत्र में सवाल पूछने की परंपरा को जीवित रखना। तंजनामा पर हम तंज (satire) और गंभीर विश्लेषण का संतुलन बनाते हुए निष्पक्ष नागरिक पत्रकारिता को बढ़ावा देते हैं।
        </p>

        <h2 style={{ fontSize: '20px', margin: '24px 0 12px', color: 'var(--primary)' }}>हम क्या कवर करते हैं?</h2>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#334155' }}>
          <li><strong>आज का तंज:</strong> दिन की सबसे चर्चित घटना पर कटाक्ष व रचनात्मक तंज।</li>
          <li><strong>राष्ट्रीय व राजस्थान:</strong> प्रादेशिक एवं देश भर की महत्वपूर्ण राजनीतिक और सामाजिक घटनाएँ।</li>
          <li><strong>डेटा स्टोरी:</strong> आंकड़ों के आईने में नीतिगत फैसलों का गहराई से परीक्षण।</li>
          <li><strong>नागरिक पत्रकारिता:</strong> आम जनता की आवाज और जमीनी मुद्दे।</li>
        </ul>
      </div>
    </main>
  );
}
