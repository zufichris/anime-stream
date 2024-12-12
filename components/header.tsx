"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, User, Sun, Moon, X } from 'lucide-react';
import { useTheme } from "@/components/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { SearchResults } from "@/components/search-results";
import { useDebouncedCallback } from "use-debounce";
import { staticData } from "@/static";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        handleCloseSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-black bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-red-600 font-bold text-2xl mr-8">
            {staticData.appName}
          </Link>
          <nav className={`hidden md:flex space-x-4 ${isSearchOpen ? 'md:hidden' : ''}`}>
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
        <div className={`flex items-center space-x-4 ${isSearchOpen ? 'w-full md:w-auto justify-end' : ''}`}>
          <div className={`relative ${isSearchOpen ? 'w-full md:w-auto' : ''}`}>
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center w-full">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white w-full"
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
            {isSearchOpen && <SearchResults query={searchQuery} onResultClick={handleCloseSearch} />}
          </div>
          {!isSearchOpen && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="text-black dark:text-white w-5 h-5 cursor-pointer" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Notifications</h3>
                    <p>You have no new notifications.</p>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="text-black dark:text-white w-5 h-5 cursor-pointer" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Account</h3>
                    <ul className="space-y-2">
                      <li><Link href="/profile">Profile</Link></li>
                      <li><Link href="/settings">Settings</Link></li>
                      <li><Button variant="ghost">Sign Out</Button></li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
