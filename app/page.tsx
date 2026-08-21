import { getPublishedPosts } from '@/lib/db';
import HomePageFeed from '@/components/HomePageFeed';

export default async function Home() {
  const posts = await getPublishedPosts(15);

  return (
    <main className="page-container">
      <div className="container">
        <HomePageFeed initialPosts={posts} />
      </div>
    </main>
  );
}