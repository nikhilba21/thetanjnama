import { getPublishedPosts } from '@/lib/db';
import HomePageFeed from '@/components/HomePageFeed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const posts = await getPublishedPosts(30);

  return (
    <main className="page-container">
      <div className="container">
        <HomePageFeed initialPosts={posts} />
      </div>
    </main>
  );
}