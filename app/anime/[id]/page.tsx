import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayCircle, Plus, ThumbsUp } from "lucide-react";
import { EpisodeList } from "@/components/episode-list";
import { aniListAdapter } from "@/lib/api/anime-list";
import { Suspense } from "react";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const anime = await aniListAdapter.getById(Number(params.id));
  const episodes = await aniListAdapter.getAnimeEpisodes(Number(params.id));
  if (!anime) {
    notFound();
  }

  return (
    <Suspense>
      <div className="min-h-screen bg-white dark:bg-black pt-16">
        <div className="relative h-[50vh]">
          <Image
            src={anime.imgLg}
            alt={anime.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            {anime.title}
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {/* {anime.rating} Rating */}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {/* {anime.year} */}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {/* {anime.seasons} Season(s) */}
            </span>
          </div>
          <p
            dangerouslySetInnerHTML={{ __html: anime.description }}
            className="text-black dark:text-white mb-6"
          />
          <div className="flex space-x-4 mb-8">
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
              <PlayCircle className="mr-2 h-4 w-4" /> Play
            </Button>
            <Button
              variant="outline"
              className="text-black dark:text-white border-black dark:border-white"
            >
              <Plus className="mr-2 h-4 w-4" /> My List
            </Button>
            <Button
              variant="outline"
              className="text-black dark:text-white border-black dark:border-white"
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Rate
            </Button>
          </div>
          {episodes.length ? (
            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Episodes
              </h2>
              <EpisodeList episodes={episodes} />
            </div>
          ) : (
            <>No Episodes Uploaded</>
          )}
        </div>
      </div>
    </Suspense>
  );
}
