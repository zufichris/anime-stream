import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlayCircle, Plus, ThumbsUp } from 'lucide-react';
import { EpisodeList } from "@/components/episode-list";
import { aniListAdapter } from "@/lib/api/anime-list";
import { Suspense } from "react";
import { staticData } from "@/static";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const anime = await aniListAdapter.getById(Number(params.id));

  if (!anime) {
    return {
      title: `Anime not found | ${staticData.appName}`,
      description: `This anime does not exist on ${staticData.appName}.`,
    };
  }

  return {
    title: `${anime.title} | ${staticData.appName}`,
    description: `Watch ${anime.title} on ${staticData.appName} for free.`,
    openGraph: {
      title: anime.title,
      description: `${anime.description} Watch on ${staticData.appName}.`,
      images: anime.imgLg,
      url: `https://${staticData.appName.toLowerCase()}-azure.vercel.app/anime/${params.id}`,
      type: "website",
    },
  };
}

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const anime = await aniListAdapter.getById(Number(params.id));
  if (!anime) {
    notFound();
  }

  return (
    <Suspense>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <div className="relative h-64 md:h-full md:w-64">
                  <Image
                    src={anime.imgLg}
                    alt={anime.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {anime.title}
                </h1>
                <p
                  dangerouslySetInnerHTML={{
                    __html: anime.description??"",
                  }}
                  className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3"
                />
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <PlayCircle className="mr-2 h-4 w-4" /> Play
                  </Button>
                  <Button variant="outline" className="text-gray-700 dark:text-gray-200">
                    <Plus className="mr-2 h-4 w-4" /> My List
                  </Button>
                  <Button variant="outline" className="text-gray-700 dark:text-gray-200">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Rate
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Episodes
            </h2>
            <EpisodeList animeId={Number(params.id)} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}

