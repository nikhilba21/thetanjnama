const posts = [
  { category: 'राजस्थान', title: 'राजस्थान की सियासत में फिर तेज हुई हलचल, बड़े फैसले पर सबकी नजर', excerpt: 'प्रदेश की राजनीति में लगातार बदलते समीकरणों के बीच अब अगला कदम किसका होगा, इस पर चर्चा तेज है।' },
  { category: 'राष्ट्रीय', title: 'देश की राजनीति में नए सवाल, पुराने जवाबों से नहीं चलेगा काम', excerpt: 'बदलते राजनीतिक और सामाजिक माहौल पर एक नजर।' },
  { category: 'विश्लेषण', title: 'आंकड़ों के पीछे की कहानी: जो खबरों की सुर्खियों में नहीं दिखती', excerpt: 'डेटा को समझिए और जानिए तस्वीर का दूसरा पहलू।' },
  { category: 'समाज', title: 'सोशल मीडिया के दौर में बदलती नागरिक पत्रकारिता', excerpt: 'आम नागरिक अब खबर का दर्शक ही नहीं, हिस्सा भी है।' },
  { category: 'Editorial', title: 'सवाल पूछना लोकतंत्र की सबसे जरूरी आदत क्यों है?', excerpt: 'एक संपादकीय टिप्पणी।' },
  { category: 'Fact Check', title: 'वायरल दावे की पड़ताल: सच क्या है?', excerpt: 'दावे, स्रोत और उपलब्ध तथ्यों के आधार पर जांच।' }
];

export default function Home() {
  return <main className="main"><div className="container">
    <div className="grid">
      <article className="hero"><div><div className="eyebrow">आज का तंज • Featured</div><h1>खबर सिर्फ खबर नहीं होती, उसके पीछे एक कहानी भी होती है</h1><p>Tanjnama पर पढ़िए खबरों के साथ उनका संदर्भ, असर और वह सवाल जो अक्सर सुर्खियों के पीछे छूट जाता है।</p><div className="meta">19 अगस्त 2026 • Tanjnama Desk</div></div></article>
      <aside className="side">{posts.slice(0,3).map(p=><article className="card" key={p.title}><div className="eyebrow">{p.category}</div><h3>{p.title}</h3><div className="meta">आज • Tanjnama</div></article>)}</aside>
    </div>
    <div className="section-title"><h2>ताजा खबरें</h2><span className="meta">View all →</span></div>
    <div className="articles">{posts.map(p=><article className="card" key={p.title}><div className="eyebrow">{p.category}</div><h2>{p.title}</h2><p>{p.excerpt}</p><div className="meta">19 अगस्त 2026 • 5 min read</div></article>)}</div>
    <div className="section-title"><h2>Ad Space</h2></div>
    <div className="card" style={{minHeight:120,textAlign:'center',paddingTop:48}}><span className="meta">Google AdSense placement — AdSense approval के बाद यहां ad unit लगाया जाएगा</span></div>
  </div></main>
}