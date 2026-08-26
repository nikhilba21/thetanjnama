export interface PageItem {
  slug: 'about' | 'contact' | 'privacy-policy' | 'disclaimer';
  title: string;
  content: string;
  updated_at: string;
}

const initialPages: Record<string, PageItem> = {
  about: {
    slug: 'about',
    title: 'हमारे बारे में (About Us)',
    content: `<h2>TANJNAMA — सोच पर तंज, सच के साथ</h2>
<p>TANJNAMA (तंजनामा) एक स्वतंत्र और निष्पक्ष डिजिटल समाचार व विचार मंच है। हमारा मुख्य उद्देश्य राजनीति, समाज, अर्थव्यवस्था और समसामयिक विषयों पर बिना किसी पक्षपात के सच्ची और तीखी तस्वीर प्रस्तुत करना है।</p>
<h3>हमारा उद्देश्य</h3>
<p>आज के दौर में जहां खबरें सनसनी और टीआरपी की भेंट चढ़ रही हैं, वहीं तंजनामा का प्रयास है कि हम खबरों के बीच से छुपा हुआ सच और उस पर आधारित निष्पक्ष विश्लेषण पाठकों तक पहुंचाएं।</p>
<h3>संपादकीय सिद्धांत</h3>
<p>1. <strong>निष्पक्षता:</strong> हम किसी भी राजनीतिक दल या विचारधारा से बंधे बिना काम करते हैं।<br/>2. <strong>सत्यता:</strong> खबरों की प्रामाणिकता और तथ्यों की जांच हमारी पहली प्राथमिकता है।<br/>3. <strong>नागरिक आवाज:</strong> हम आम जनता की समस्याओं और मुद्दों को प्रमुखता से उठाते हैं।</p>`,
    updated_at: new Date().toISOString()
  },
  contact: {
    slug: 'contact',
    title: 'संपर्क करें (Contact Us)',
    content: `<h2>तंजनामा टीम से संपर्क करें</h2>
<p>यदि आपके पास कोई समाचार, सुझाव, शिकायत या विज्ञापन से जुड़ा प्रश्न है, तो आप हमसे नीचे दिए गए माध्यमों से संपर्क कर सकते हैं:</p>
<div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1; margin: 20px 0;">
<p><strong>📧 मुख्य ईमेल:</strong> editor@tanjnama.com</p>
<p><strong>📱 व्हाट्सएप / हेल्पडेस्क:</strong> +91 98290 XXXXX</p>
<p><strong>📍 कार्यालय पता:</strong> तंजनामा मीडिया डेस्क, जयपुर, राजस्थान (भारत)</p>
</div>
<h3>संपादकीय प्रतिक्रिया एवं लेख सबमिशन</h3>
<p>यदि आप तंजनामा पर अपना लेख, विचार या नागरिक पत्रकारिता रिपोर्ट प्रकाशित कराना चाहते हैं, तो कृपया अपनी सामग्री हमारे संपादक को ईमेल द्वारा भेजें।</p>`,
    updated_at: new Date().toISOString()
  },
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'गोपनीयता नीति (Privacy Policy)',
    content: `<h2>TANJNAMA Privacy Policy</h2>
<p>Tanjnama (तंजनामा) अपने पाठकों की गोपनीयता का पूरा सम्मान करता है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट का उपयोग करते हैं, तो आपकी कौन सी जानकारी एकत्रित की जाती है और उसका उपयोग कैसे किया जाता है।</p>
<h3>1. जानकारी का संग्रहण</h3>
<p>हम किसी भी उपयोगकर्ता की व्यक्तिगत पहचान से जुड़ी जानकारी (जैसे नाम, ईमेल या फोन नंबर) तभी एकत्र करते हैं जब पाठक खुद इसे कमेंट्स, फॉर्म्स या न्यूज़लेटर रजिस्ट्रेशन द्वारा प्रदान करते हैं।</p>
<h3>2. ककीज (Cookies) और विज्ञापन</h3>
<p>हमारी वेबसाइट गूगल एडसेंस (Google AdSense) और अन्य थर्ड-पार्टी विज्ञापनों का उपयोग कर सकती है। गूगल और इसके पार्टनर यूजर की प्राथमिकताओं के आधार पर विज्ञापन दिखाने के लिए कुकीज़ का उपयोग करते हैं।</p>
<h3>3. सुरक्षा</h3>
<p>हम पाठकों की जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक उपाय करते हैं। हम आपकी व्यक्तिगत जानकारी को किसी तीसरे पक्ष को बेचते या साझा नहीं करते हैं।</p>`,
    updated_at: new Date().toISOString()
  },
  disclaimer: {
    slug: 'disclaimer',
    title: 'अस्वीकरण (Disclaimer)',
    content: `<h2>TANJNAMA Disclaimer Policy</h2>
<p>तंजनामा (Tanjnama) वेबसाइट पर प्रकाशित सभी खबरें, विचार और विश्लेषण सूचनात्मक और वैचारिक उद्देश्यों के लिए प्रदान किए जाते हैं।</p>
<h3>1. सामग्री की सटीकता</h3>
<p>हम अपनी खबरों और लेखों की सटीकता सुनिश्चित करने का पूरा प्रयास करते हैं, लेकिन किसी भी त्रुटि या अनजाने में हुई चूक के लिए तंजनामा विधिक रूप से जिम्मेदार नहीं होगा।</p>
<h3>2. बाहरी लिंक्स</h3>
<p>हमारी वेबसाइट में अन्य बाहरी वेबसाइटों के लिंक्स हो सकते हैं। उन बाहरी साइटों की सामग्री या गोपनीयता नीतियों पर हमारा कोई नियंत्रण नहीं है।</p>
<h3>3. पाठकों की टिप्पणियां</h3>
<p>वेबसाइट या आज का सवाल पर पाठकों द्वारा भेजी गई प्रतिक्रियाएं उनकी व्यक्तिगत राय हैं। उन विचारों से तंजनामा प्रबंधन का सहमत होना आवश्यक नहीं है।</p>`,
    updated_at: new Date().toISOString()
  }
};

let inMemoryPages: Record<string, PageItem> = { ...initialPages };

export function getPageBySlug(slug: string): PageItem | null {
  return inMemoryPages[slug] || null;
}

export function getAllPages(): PageItem[] {
  return Object.values(inMemoryPages);
}

export function updatePageContent(slug: string, title: string, content: string): PageItem | null {
  if (inMemoryPages[slug]) {
    inMemoryPages[slug] = {
      ...inMemoryPages[slug],
      title: title.trim(),
      content: content.trim(),
      updated_at: new Date().toISOString()
    };
    return inMemoryPages[slug];
  }
  return null;
}
