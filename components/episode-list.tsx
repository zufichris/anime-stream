"use client";

import { PlayCircle } from "lucide-react";
import { IEpisode } from "@/@types/anime";
import { useCallback, useEffect, useState } from "react";
import { getEpisodes } from "@/lib/actions/anime";
import { Button } from "./ui/button";
import Link from "next/link";
import { AnimePlayer } from "./anime-player";

interface EpisodeListProps {
  readonly animeId: number;
}

export function EpisodeList({ animeId }: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<IEpisode[] | null>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [current, setCurrent] = useState<IEpisode | null>(null);

  const fetchEpisodes = useCallback(async () => {
    try {
      const result = await getEpisodes(animeId, { limit, page });
      setEpisodes(result?.episodes || []);
      setTotalCount(result?.total || 0);
      if (!current && result?.episodes?.length) {
        setCurrent(result.episodes[0]);
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  }, [animeId, page, limit, current]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  const handlePlay = (episode: IEpisode) => {
    setCurrent(episode);
  };

  const totalPages = Math.ceil(totalCount / limit);
  const startEpisode = (page - 1) * limit + 1;
  const endEpisode = Math.min(page * limit, totalCount);

  return (
    <div className="space-y-6">
      {current && <AnimePlayer ep={current} />}

      <div className="max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          {episodes?.length ? (
            episodes.map((episode) => (
              <div
                key={episode.number}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {episode.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uploaded by {episode.userId}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant={"outline"}
                    className="rounded-full w-10 h-10 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                    onClick={() => handlePlay(episode)}
                  >
                    <PlayCircle className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No episodes available.
              </p>
              <Link href={`/upload/${animeId}`}>
                <Button>Upload Episodes</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {episodes?.length ? (
        <div className="mt-6 space-y-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Showing episodes {startEpisode}-{endEpisode} of {totalCount}
          </div>
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              variant="outline"
              size="sm"
              disabled={page === 1}
            >
              Previous Page
            </Button>

            <span className="text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              variant="outline"
              size="sm"
              disabled={page === totalPages}
            >
              Next Page
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
