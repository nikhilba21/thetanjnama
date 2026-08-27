import type { Metadata } from 'next';
import Link from 'next/link';
import CitizenJournalismForm from '@/components/CitizenJournalismForm';
import SocialShareBar from '@/components/SocialShareBar';

export const metadata: Metadata = {
  title: 'नागरिक पत्रकारिता में योगदान दें — आपकी खबर, आपके क्षेत्र की आवाज़ | TANJNAMA',
  description:
    'TANJNAMA (तंजनामा) नागरिकों को अपने क्षेत्र की महत्वपूर्ण खबरें, जनसमस्याएँ और तथ्यात्मक लेख साझा करने का मंच प्रदान करता है। जानिए नियम, शर्तें और खबर भेजने की प्रक्रिया।',
  alternates: {
    canonical: 'https://www.tanjnama.com/nagrik-patrakarita'
  },
  openGraph: {
    title: 'नागरिक पत्रकारिता — TANJNAMA',
    description: 'आपकी खबर, आपके क्षेत्र की आवाज़। तंजनामा नागरिक पत्रकारिता मंच पर अपनी खबर सबमिट करें।',
    url: 'https://www.tanjnama.com/nagrik-patrakarita'
  }
};

export default function NagrikPatrakaritaPage() {
  return (
    <main className="page-container" style={{ background: '#f8fafc', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* BREADCRUMB */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            होम
          </Link>{' '}
          / <span>नागरिक पत्रकारिता (Citizen Journalism)</span>
        </div>

        {/* HERO BANNER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '36px 32px',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            marginBottom: '32px'
          }}
        >
          <span
            style={{
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            जनमत व नागरिक आवाज़
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 900, marginTop: '12px', marginBottom: '10px', lineHeight: 1.2 }}>
            नागरिक पत्रकारिता में योगदान दें
          </h1>
          <p style={{ fontSize: '18px', color: '#cbd5e1', fontWeight: 500 }}>
            आपकी खबर, आपके क्षेत्र की आवाज़
          </p>
        </div>

        {/* SOCIAL SHARE BAR */}
        <SocialShareBar
          title="नागरिक पत्रकारिता में योगदान दें — आपकी खबर, आपके क्षेत्र की आवाज़"
          url="https://www.tanjnama.com/nagrik-patrakarita"
          subtext="अपने क्षेत्र की जनसमस्याएं, महत्वपूर्ण खबरें व नागरिक लेख हमारे साथ साझा करने के लिए इस लिंक पर क्लिक करें:"
        />

        {/* POLICY CONTENT DOCUMENT */}
        <div
          style={{
            background: '#ffffff',
            padding: '36px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontSize: '15px',
            lineHeight: 1.8,
            color: '#334155'
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '24px' }}>
            आपके आसपास होने वाली कई महत्वपूर्ण घटनाएँ और स्थानीय समस्याएँ ऐसी होती हैं, जिनकी जानकारी व्यापक स्तर तक नहीं पहुँच पाती। हमारा उद्देश्य नागरिकों को अपनी बात जिम्मेदारी और तथ्यों के साथ सामने रखने का अवसर देना है।
          </p>
          <p style={{ marginBottom: '24px' }}>
            यदि आपके क्षेत्र में कोई जनहित से जुड़ी खबर, स्थानीय समस्या, महत्वपूर्ण घटना, उपलब्धि या उपयोगी जानकारी है, तो आप उसे हमारे साथ साझा कर सकते हैं।
          </p>

          <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          {/* SECTION 1 */}
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--dark-bg)', marginBottom: '14px' }}>
            📌 आप क्या भेज सकते हैं?
          </h2>
          <p style={{ marginBottom: '12px' }}>आप निम्न प्रकार की सामग्री हमारे साथ साझा कर सकते हैं:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <li>💧 सड़क, पानी, बिजली, सफाई और यातायात से जुड़ी समस्याएँ</li>
            <li>🏛️ स्थानीय प्रशासन एवं सार्वजनिक सुविधाओं से संबंधित मुद्दे</li>
            <li>🏥 शिक्षा और स्वास्थ्य से जुड़ी स्थानीय खबरें</li>
            <li>🤝 सामाजिक एवं सामुदायिक कार्यक्रम</li>
            <li>🏆 स्थानीय खेल, कला, संस्कृति और अन्य उपलब्धियाँ</li>
            <li>🌱 पर्यावरण से संबंधित स्थानीय समस्याएँ</li>
            <li>📢 स्थानीय घटनाएँ और जनहित से जुड़ी महत्वपूर्ण सूचनाएँ</li>
            <li>🔍 किसी वायरल स्थानीय दावे या खबर की तथ्य-जाँच के लिए सूचना</li>
            <li>📸 स्वयं द्वारा बनाए गए फोटो और वीडियो</li>
            <li>✍️ किसी जनहित विषय पर तथ्यों और प्रमाणों पर आधारित नागरिक लेख</li>
          </ul>

          <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          {/* SECTION 2 */}
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--dark-bg)', marginBottom: '16px' }}>
            📜 खबर भेजने से पहले जरूरी नियम एवं शर्तें
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>1. सही जानकारी दें</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>खबर या जानकारी भेजते समय तथ्यों की यथासंभव जाँच करें। जानबूझकर झूठी, भ्रामक या अफवाह आधारित जानकारी न भेजें।</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>2. गंभीर आरोपों में प्रमाण दें</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>किसी व्यक्ति, संस्था, अधिकारी या संगठन पर भ्रष्टाचार, धोखाधड़ी, अपराध या अन्य गंभीर आरोप लगाने वाली सामग्री बिना विश्वसनीय प्रमाण के न भेजें। केवल आरोप या सोशल मीडिया पोस्ट को स्वतः सत्य मानकर प्रस्तुत न करें।</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>3. वायरल खबरों में सावधानी रखें</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>यदि आप सोशल मीडिया पर वायरल किसी दावे या खबर के बारे में जानकारी भेज रहे हैं, तो उसे स्पष्ट रूप से “सत्यापन हेतु” बताएं।</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>4. निजी जानकारी साझा न करें</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>किसी व्यक्ति का मोबाइल नंबर, घर का पता, पहचान-पत्र, बैंक संबंधी जानकारी या अन्य निजी जानकारी उसकी अनुमति के बिना साझा न करें, जब तक उसका स्पष्ट और उचित जनहित संबंध न हो।</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>5. फोटो और वीडियो</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>जहाँ तक संभव हो, स्वयं द्वारा बनाए गए फोटो और वीडियो भेजें। किसी अन्य वेबसाइट, समाचार माध्यम या सोशल मीडिया अकाउंट से सामग्री कॉपी करके न भेजें।</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>6. कॉपीराइट का सम्मान करें</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>किसी अन्य व्यक्ति या संस्था की कॉपीराइट-संरक्षित फोटो, वीडियो, लेख या अन्य सामग्री को बिना उचित अधिकार/अनुमति के भेजने से बचें।</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>7. आपत्तिजनक सामग्री न भेजें</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>अश्लील, घृणा फैलाने वाली, धमकीपूर्ण, भेदभावपूर्ण या किसी व्यक्ति अथवा समुदाय को निशाना बनाने वाली सामग्री स्वीकार नहीं की जाएगी।</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>8. व्यक्तिगत विवाद से बचें</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>नागरिक पत्रकारिता का उपयोग व्यक्तिगत दुश्मनी, बदला लेने, किसी व्यक्ति को बदनाम करने या निजी विवाद को सार्वजनिक करने के लिए न करें।</p>
            </div>
          </div>

          <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          {/* SECTION 3 */}
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--dark-bg)', marginBottom: '14px' }}>
            ⚙️ संपादकीय प्रक्रिया एवं जिम्मेदारियाँ
          </h2>
          <p style={{ marginBottom: '12px' }}>
            हमारे पास प्राप्त प्रत्येक सामग्री को प्रकाशित करना आवश्यक नहीं है। प्रकाशन से पहले हमारी टीम उपलब्ध जानकारी का आवश्यक सत्यापन और संपादकीय परीक्षण कर सकती है।
          </p>
          <p style={{ marginBottom: '16px' }}>
            संपादकीय टीम को प्राप्त सामग्री को प्रकाशित करने, अस्वीकार करने, संपादित करने, छोटा करने, शीर्षक बदलने या आवश्यक संदर्भ जोड़ने का पूरा अधिकार रहेगा।
          </p>

          <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

          {/* DISCLAIMER SECTION */}
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '20px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b', marginBottom: '10px' }}>
              ⚖️ अस्वीकरण (Disclaimer)
            </h3>
            <p style={{ fontSize: '13px', color: '#7f1d1d', lineHeight: 1.7, marginBottom: '10px' }}>
              इस वेबसाइट पर नागरिक पत्रकारिता के अंतर्गत पाठकों/नागरिकों द्वारा भेजी गई जानकारी, फोटो, वीडियो अथवा अन्य सामग्री को सूचना एवं जनहित के उद्देश्य से प्रस्तुत किया जाता है। ऐसी सामग्री आवश्यक रूप से वेबसाइट या उसकी संपादकीय टीम के विचारों अथवा दावों का प्रतिनिधित्व नहीं करती।
            </p>
            <p style={{ fontSize: '12px', color: '#991b1b', fontStyle: 'italic', margin: 0 }}>
              नोट: "नागरिक लेख में व्यक्त विचार संबंधित लेखक के व्यक्तिगत विचार हैं और आवश्यक रूप से ब्लॉगर/संपादकीय टीम के विचार नहीं हैं।"
            </p>
          </div>

          {/* CONTACT DETAILS */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '8px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af', marginBottom: '8px' }}>
              📧 सीधा ईमेल से खबर भेजें
            </h3>
            <p style={{ fontSize: '14px', color: '#1e3a8a', marginBottom: '8px' }}>
              आप सीधे हमें अपनी रिपोर्ट ईमेल द्वारा भी भेज सकते हैं:
            </p>
            <a href="mailto:tanjnama@gmail.com" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
              tanjnama@gmail.com
            </a>
          </div>
        </div>

        {/* EMBEDDED FORM SECTION */}
        <div id="citizen-form-section">
          <CitizenJournalismForm />
        </div>
      </div>
    </main>
  );
}
