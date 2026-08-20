import Link from 'next/link';
import { getPublishedPosts } from '@/lib/db';
import AdSense from '@/components/AdSense';

const categories=['आज का तंज','राष्ट्रीय','राजस्थान','राजनीति','समाज','विश्लेषण','Data Story','Editorial','Fact Check','नागरिक पत्रकारिता','Videos'];
const fallback=[
 {id:'1',slug:'#',category:'राजस्थान',title:'राजस्थान की सियासत में फिर तेज हुई हलचल, बड़े फैसले पर सबकी नजर',excerpt:'प्रदेश की राजनीति में लगातार बदलते समीकरणों के बीच अब अगला कदम किसका होगा, इस पर चर्चा तेज है।'},
 {id:'2',slug:'#',category:'राष्ट्रीय',title:'देश की राजनीति में नए सवाल, पुराने जवाबों से नहीं चलेगा काम',excerpt:'बदलते राजनीतिक और सामाजिक माहौल पर एक नजर।'},
 {id:'3',slug:'#',category:'विश्लेषण',title:'आंकड़ों के पीछे की कहानी: जो खबरों की सुर्खियों में नहीं दिखती',excerpt:'डेटा को समझिए और जानिए तस्वीर का दूसरा पहलू।'},
 {id:'4',slug:'#',category:'समाज',title:'सोशल मीडिया के दौर में बदलती नागरिक पत्रकारिता',excerpt:'आम नागरिक अब खबर का दर्शक ही नहीं, हिस्सा भी है।'},
 {id:'5',slug:'#',category:'Editorial',title:'सवाल पूछना लोकतंत्र की सबसे जरूरी आदत क्यों है?',excerpt:'एक संपादकीय टिप्पणी।'},
 {id:'6',slug:'#',category:'Fact Check',title:'वायरल दावे की पड़ताल: सच क्या है?',excerpt:'दावे, स्रोत और उपलब्ध तथ्यों के आधार पर जांच।'}
];
export default async function Home(){const live=await getPublishedPosts(12);const posts=live.length?live:fallback;const hero=posts[0];return <main>
<section className="ticker"><div className="container ticker-inner"><b>ताजा खबर</b><span>{hero.title}</span></div></section>
<div className="container page"><div className="main-grid"><section>
<div className="section-head"><h2>Latest News</h2><span>खबर • तंज • विश्लेषण</span></div>
<div className="lead-grid"><Link href={hero.slug==='#'?'#':'/posts/'+hero.slug} className="lead-card"><div className="image-placeholder"><span>{hero.category}</span></div><div className="lead-info"><div className="tag">{hero.category}</div><h1>{hero.title}</h1><p>{hero.excerpt}</p><small>By Tanjnama Desk • आज</small></div></Link><div className="hot-list">{posts.slice(1,4).map(p=><Link href={p.slug==='#'?'#':'/posts/'+p.slug} className="hot-item" key={p.id}><div className="mini-image">{p.category}</div><div><b>{p.title}</b><small>{p.category} • आज</small></div></Link>)}</div></div>
<div className="section-head"><h2>Latest Posts</h2><span>View All</span></div><div className="post-grid">{posts.slice(1).map(p=><Link href={p.slug==='#'?'#':'/posts/'+p.slug} className="post-card" key={p.id}><div className="post-image"><span>{p.category}</span></div><div className="post-info"><div className="tag">{p.category}</div><h3>{p.title}</h3><p>{p.excerpt}</p><small>आज • Tanjnama Desk</small></div></Link>)}</div>
</section><aside><div className="widget"><h3>Advertisement</h3><AdSense/></div><div className="widget"><h3>Popular Posts</h3>{posts.slice(0,5).map((p,i)=><Link href={p.slug==='#'?'#':'/posts/'+p.slug} className="popular" key={p.id}><strong>{String(i+1).padStart(2,'0')}</strong><span>{p.title}</span></Link>)}</div><div className="widget"><h3>Categories</h3><div className="cats">{categories.map(c=><Link key={c} href={'/category/'+encodeURIComponent(c)}>{c}</Link>)}</div></div></aside></div></div></main>}