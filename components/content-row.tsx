"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IAnime, IAnimeList } from "@/@types/anime";
import { useEffect, useRef, useState } from "react";
import { aniListAdapter } from "@/lib/api/anime-list";

interface ContentRowProps {
  title: string;
  initialItems: IAnimeList;
}

export function ContentRow({ title, initialItems }: ContentRowProps) {
  const router = useRouter();
  const [items, setItems] = useState<IAnime[]>(initialItems?.list);
  const [page, setPage] = useState(initialItems?.page);
  const [hasNextPage, setHasNextPage] = useState(initialItems?.hasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleItemClick = (id: number | string) => {
    router.push(`/anime/${id}`);
  };
  const loadMore = async () => {
    try {
      const newList = await aniListAdapter.getAnimeList({
        sort: "TRENDING_DESC",
        limit: 10,
      });
      return newList;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = async () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      if (
        scrollWidth - (scrollLeft + clientWidth) < 20 &&
        !isLoading &&
        hasNextPage
      ) {
        setIsLoading(true);
        const newItems = await loadMore();
        setItems((prevItems) => [...prevItems, ...newItems!.list]);
        setPage(newItems!.page);
        setHasNextPage(newItems!.hasNextPage);
        setIsLoading(false);
      }
    }
  };

  const startAutoScroll = () => {
    // if (scrollContainerRef.current) {
    //   const scrollAmount = 1;
    //   scrollContainerRef.current.scrollLeft += scrollAmount;
    //   if (
    //     scrollContainerRef.current.scrollLeft >=
    //     scrollContainerRef.current.scrollWidth -
    //       scrollContainerRef.current.clientWidth
    //   ) {
    //     scrollContainerRef.current.scrollLeft = 0;
    //   }
    //   timeoutRef.current = setTimeout(startAutoScroll, 50);
    // }
  };

  const stopAutoScroll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isLoading, hasNextPage]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      let inactivityTimer: NodeJS.Timeout;

      const resetTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        stopAutoScroll();
        inactivityTimer = setTimeout(startAutoScroll, 5000);
      };

      container.addEventListener("mousemove", resetTimer);
      container.addEventListener("mousedown", resetTimer);
      resetTimer();

      return () => {
        container.removeEventListener("mousemove", resetTimer);
        container.removeEventListener("mousedown", resetTimer);
        if (inactivityTimer) clearTimeout(inactivityTimer);
        stopAutoScroll();
      };
    }
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
        {title}
      </h2>
      {items?.length ? (
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => handleItemClick(item.id)}
            >
              <Image
                src={item.imgLg}
                alt={item.title}
                width={160}
                height={90}
                className="rounded-md object-cover"
              />
              <p className="mt-2 text-sm text-black dark:text-white w-40">
                {item.title}
              </p>
            </div>
          ))}
          {isLoading && (
            <div className="flex-none w-40 h-[90px] bg-gray-200 animate-pulse rounded-md">
              {page}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
