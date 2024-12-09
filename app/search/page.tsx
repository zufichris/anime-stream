import { ContentRow } from "@/components/content-row";
import { aniListAdapter } from "@/lib/api/anime-list";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || "all";
  const results = await aniListAdapter.search(query);
  return (
    <main className="min-h-screen bg-white dark:bg-black pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-6">
          Search Results for &quot;{query}&quot;
        </h1>
        {results.length > 0 ? (
          <ContentRow
            title="Results"
            initialItems={{
              list: results,
              hasNextPage: false,
              limit: 10,
              page: 1,
            }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-black dark:text-white text-xl mb-4">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search. Here are some ideas:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2">
              <li>Check your spelling</li>
              <li>Use fewer keywords</li>
              <li>Try using a different word or phrase</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
