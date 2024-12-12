import { IAnime } from "@/@types/anime";
import { Button } from "@/components/ui/button";
import { PlayCircle, InfoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero({ hero }: { hero: IAnime }) {
  return (
    <div className="relative w-full h-[56.25vw] max-h-[80vh]">
      <Image
        src={hero.imgLg}
        alt={hero.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 dark:from-black/80 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white">
            {hero?.title}
          </h1>
          <p
            dangerouslySetInnerHTML={{
              __html:
                hero?.description
                  ?.split("+")[0]
                  ?.substring(0, 150)
                  ?.concat("...") ?? "",
            }}
            className="text-lg text-black dark:text-white"
          />
          <div className="space-x-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <PlayCircle className="mr-2 h-4 w-4" /> Play
            </Button>
            <Button
              variant="outline"
              className="text-black dark:text-white border-black dark:border-white hover:bg-black/10 dark:hover:bg-white/10"
            >
              <Link href={`/anime/${hero.id}`} className="flex items-center">
                <InfoIcon className="mr-2 h-4 w-4" /> More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
