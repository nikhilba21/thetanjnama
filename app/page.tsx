import { getPublishedPosts } from '@/lib/db';
import HomePageFeed from '@/components/HomePageFeed';

export const revalidate = 60;

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