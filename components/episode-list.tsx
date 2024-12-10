"use client";
import { PlayCircle } from "lucide-react";
import { IEpisode } from "@/@types/anime";
interface EpisodeListProps {
  episodes: IEpisode[];
}

export function EpisodeList({ episodes }: EpisodeListProps) {
  const handlePlay = (episodeId: string) => {
    console.log(`Playing episode ${episodeId}`);
    // Here you would typically initiate playback of the episode
  };

  return (
    <div className="space-y-4">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 group py-3"
        >
          <div className="flex items-center justify-between p-4 cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {episode.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {episode.duration}
              </p>
            </div>
            <PlayCircle
              onClick={(e) => {
                e.preventDefault();
                handlePlay(episode.id);
              }}
              className="h-6 w-6 text-black dark:text-white transition-transform duration-300 ease-in-out transform group-hover:scale-110"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
