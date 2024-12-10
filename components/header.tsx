"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Bell, Search, User, Sun, Moon, X } from "lucide-react";
import { useTheme } from "@/components/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { SearchResults } from "@/components/search-results";
import { useDebouncedCallback } from "use-debounce";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState("");
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setText("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(text.trim())}`, {
        scroll: true,
      });
      handleCloseSearch();
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-black bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-red-600 font-bold text-2xl mr-8">
            ThisAintAnime
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              Home
            </Link>
            <Link
              href="/tv-shows"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              TV Shows
            </Link>
            <Link
              href="/movies"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              Movies
            </Link>
            <Link
              href="/new"
              className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            >
              New & Popular
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleCloseSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleSearchClick}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            {isSearchOpen && <SearchResults query={searchQuery} />}
          </div>
          <Bell className="text-black dark:text-white w-5 h-5 cursor-pointer" />
          <User className="text-black dark:text-white w-5 h-5 cursor-pointer" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
