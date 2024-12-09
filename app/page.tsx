import { Hero } from "@/components/hero";
import { ContentRow } from "@/components/content-row";
import { aniListAdapter } from "@/lib/api/anime-list";
import { Suspense } from "react";

export default async function Home() {
  const trending = await aniListAdapter.getAnimeList({
    sort: "TRENDING_DESC",
  });
  const newRelease = await aniListAdapter.getAnimeList({
    sort: "POPULARITY_DESC",
    coverImage: "large",
  });
  const hero = await aniListAdapter.getAnimeList({
    coverImage: "large",
    description: true,
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {hero?.list.length ? <Hero hero={hero?.list[0]} /> : null}
      <Suspense fallback={<div>loading</div>}>
        <div className="container mx-auto px-4 py-8">
          <ContentRow title="Trending Now" initialItems={trending!} />
          <ContentRow title="Popular" initialItems={newRelease!} />
        </div>
      </Suspense>
    </main>
  );
}
