import { IAnime } from "@/@types/anime";
import { Button } from "@/components/ui/button";
import { PlayCircle, InfoIcon } from "lucide-react";
import Link from "next/link";

export function Hero({ hero }: { hero: IAnime }) {
  return (
    <div className="relative h-[56.25vw] max-h-[80vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${hero.imgLg}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-black to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 p-8 space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
          {hero?.title}
        </h1>
        <p
          dangerouslySetInnerHTML={{
            __html: hero?.description
              ?.split("+")[0]
              ?.substring(0, 150)
              .concat("..."),
          }}
          className="text-lg text-black dark:text-white max-w-md"
        />
        <div className="space-x-4">
          <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
            <PlayCircle className="mr-2 h-4 w-4" /> Play
          </Button>
          <Button
            variant="outline"
            className="text-black dark:text-white border-black dark:border-white"
          >
            <Link href={`/anime/${hero.id}`} className="flex justify-center">
              <InfoIcon className="mr-2 h-4 w-4" /> More Info
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
