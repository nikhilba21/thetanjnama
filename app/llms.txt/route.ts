import { NextResponse } from 'next';
import { getPublishedPosts } from '@/lib/db';
import { CATEGORY_LIST } from '@/lib/categories';

export async function GET() {
  const posts = await getPublishedPosts(50);

  let content = `# TANJNAMA (तंजनामा) — सोच पर तंज, सच के साथ

> TANJNAMA (तंजनामा) एक स्वतंत्र और निष्पक्ष डिजिटल समाचार एवं विचार मंच है। हम राजनीति, समाज, राजस्थान समाचार, राष्ट्रीय मुद्दों, डेटा स्टोरी और नागरिक पत्रकारिता पर तीखा विश्लेषण और निष्पक्ष दृष्टिकोण प्रदान करते हैं।

## मुख्य पृष्ठ एवं सूचना (Main Pages)
- [होमपेज (Homepage)](https://www.tanjnama.com/)
- [हमारे बारे में (About Us)](https://www.tanjnama.com/about): तंजनामा की संपादकीय नीति और उद्देश्य।
- [संपर्क करें (Contact Us)](https://www.tanjnama.com/contact): संपादकीय टीम, शिकायत और विज्ञापन संपर्क।
- [गोपनीयता नीति (Privacy Policy)](https://www.tanjnama.com/privacy-policy): डेटा सुरक्षा और कुकी नीति।
- [अस्वीकरण (Disclaimer)](https://www.tanjnama.com/disclaimer): विधिक सूचना।

## मुख्य श्रेणियां (Categories)
${CATEGORY_LIST.map((c) => `- [${c.name}](https://www.tanjnama.com/category/${c.slug})`).join('\n')}

## नवीनतम लेख एवं समाचार (Latest Published News & Articles)
${posts.map((p) => `- [${p.title}](https://www.tanjnama.com/posts/${p.slug}): ${p.excerpt}`).join('\n')}
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
