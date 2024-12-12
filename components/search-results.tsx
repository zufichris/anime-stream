"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { aniListAdapter } from "@/lib/api/anime-list";
import { IAnime } from "@/@types/anime";
import Link from "next/link";

interface SearchResultsProps {
  query: string;
  onResultClick: () => void;
}

export function SearchResults({ query, onResultClick }: SearchResultsProps) {
  const [results, setResults] = useState<IAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const searchAnime = async (query: string) => {
    setLoading(true);
    const list = await aniListAdapter.search(query);
    setResults(list);
    setLoading(false);
    return list;
  };

  useEffect(() => {
    if (query) {
      searchAnime(query);
    } else {
      setResults([]);
    }
  }, [query]);

  return query?.length ? (
    <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-b-lg overflow-hidden z-50">
      <div>
        <h3 className="text-lg px-2 py-3 pt-4 font-semibold text-black dark:text-white mb-2">
          Search Results
        </h3>
        <div className="space-y-2 min-h-[100px] max-h-[80vh] overflow-scroll">
          {results.length ? (
            results?.map((result) => (
              <Link
                key={result.id}
                className="flex items-center px-2.5 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                href={`/anime/${result.id}`}
                onClick={onResultClick}
              >
                <Image
                  src={result.imgMd}
                  alt={result.title}
                  width={40}
                  height={40}
                  className="rounded h-[40px] w-[40px]"
                />
                <span className="text-black px-1 dark:text-white">
                  {result.title}
                </span>
              </Link>
            ))
          ) : (
            <div className="p-4">
              {loading ? "Just Chill, Loading..." : "No Results Found"}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

