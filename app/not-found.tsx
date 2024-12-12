import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-gray-800 dark:text-gray-100">
          404
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Maybe I was too lazy to build it.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          It might have been moved, or it never existed.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
