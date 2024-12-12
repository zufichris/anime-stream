"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IAnime, IAnimeList } from "@/@types/anime";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ContentRowProps {
  title: string;
  initialItems: IAnimeList;
}

export function ContentRow({ title, initialItems }: ContentRowProps) {
  const router = useRouter();
  const [items] = useState<IAnime[]>(initialItems?.list);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleItemClick = (id: number | string) => {
    router.push(`/anime/${id}`);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Scroll by one item width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkArrows = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkArrows);
      checkArrows();
      return () => container.removeEventListener('scroll', checkArrows);
    }
  }, []);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth < scrollWidth) {
          scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 10000);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="mb-8 relative">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
        {title}
      </h2>
      <div className="relative">
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {items?.map((item) => (
            <div
              key={item.id}
              className="flex-none cursor-pointer transition-transform duration-300 hover:scale-105 snap-start"
              onClick={() => handleItemClick(item.id)}
            >
              <Image
                src={item.imgLg}
                alt={item.title}
                width={300}
                height={169}
                className="rounded-md object-cover w-[300px] h-[169px]"
              />
              <p className="mt-2 text-sm text-black dark:text-white w-[300px] truncate">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

