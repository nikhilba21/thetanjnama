import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'अस्वीकरण (Disclaimer)',
  description: 'Tanjnama अस्वीकरण नीति - सामग्री, तंज और विचार संबंधी सूचना।'
};

export default function DisclaimerPage() {
  return (
    <main className="page-container">
      <div className="container" style={{ maxWidth: '800px', background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', marginBottom: '16px', color: 'var(--dark-bg)' }}>
          अस्वीकरण (Disclaimer)
        </h1>

        <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#334155', marginBottom: '16px' }}>
          <strong>Tanjnama (तंजनामा)</strong> पर प्रकाशित सामग्री मुख्य रूप से निष्पक्ष समाचार, विश्लेषण और व्यंग्य/तंज (satire) पर आधारित है।
        </p>

        <h2 style={{ fontSize: '18px', color: 'var(--primary)', margin: '20px 0 10px' }}>व्यंग्य व तंज (Satire & Opinion Disclaimer)</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569', marginBottom: '16px' }}>
          "आज का तंज" व व्यंग्यात्मक श्रेणियों में प्रकाशित विचार केवल हास्य, कटाक्ष और सामाजिक जागरूकता के उद्देश्य से लिखे जाते हैं। इनका उद्देश्य किसी व्यक्ति, समुदाय या भावना को ठेस पहुँचाना नहीं है।
        </p>

        <h2 style={{ fontSize: '18px', color: 'var(--primary)', margin: '20px 0 10px' }}>सटीकता व बाहरी लिंक्स (Accuracy & External Links)</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569' }}>
          हम जानकारी की सटीकता बनाए रखने का हर संभव प्रयास करते हैं। हमारी वेबसाइट में अन्य बाहरी वेबसाइटों के लिंक हो सकते हैं, जिनकी सामग्री या नीतियों के लिए तंजनामा जिम्मेदार नहीं है।
        </p>
      </div>
    </main>
  );
}
