import type { Metadata } from 'next';
import { getPostsByCategory } from '@/lib/db';
import { getCategoryNameBySlug } from '@/lib/categories';
import CategoryPageFeed from '@/components/CategoryPageFeed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categoryName = getCategoryNameBySlug(categorySlug);
  const pageUrl = `https://www.tanjnama.com/category/${categorySlug}`;

  return {
    title: `${categoryName} समाचार एवं विश्लेषण | TANJNAMA`,
    description: `TANJNAMA पर ${categoryName} श्रेणी की ताजा खबरें, निष्पक्ष विश्लेषण और तीखा तंज पढ़ें।`,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: `${categoryName} — TANJNAMA`,
      description: `${categoryName} की ताजा खबरें और विश्लेषण।`,
      url: pageUrl
    }
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const categoryName = getCategoryNameBySlug(categorySlug);
  const initialPosts = await getPostsByCategory(categorySlug);

  return (
    <main className="page-container">
      <CategoryPageFeed
        categorySlug={categorySlug}
        categoryName={categoryName}
        initialPosts={initialPosts}
      />
    </main>
  );
}