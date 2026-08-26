import { NextResponse } from 'next';
import { getPublishedPosts } from '@/lib/db';

export async function GET() {
  const posts = await getPublishedPosts(100);

  let content = `# TANJNAMA (तंजनामा) — संपूर्ण समाचार सामग्री डेटाबेस (Full Content File)

> TANJNAMA — सोच पर तंज, सच के साथ। स्वतंत्र समाचार, विश्लेषण और नागरिक पत्रकारिता डिजिटल मंच।
> URL: https://www.tanjnama.com

---

${posts
  .map(
    (p) => `## ${p.title}
- **URL**: https://www.tanjnama.com/posts/${p.slug}
- **Category**: ${p.category}
- **Author**: ${p.author}
- **Published**: ${p.published_at || p.created_at}

### Excerpt
${p.excerpt}

### Full Content
${p.content.replace(/<[^>]*>?/gm, '')}

---
`
  )
  .join('\n')}`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
