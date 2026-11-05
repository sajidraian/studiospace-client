export default function Loading() {
  return (
    <main
      aria-label="Loading page"
      aria-busy="true"
      className="min-h-screen bg-white px-4 py-12 dark:bg-gray-950 sm:px-6"
    >
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="h-10 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-900 sm:h-80" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="h-48 bg-gray-100 dark:bg-gray-900" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-900" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Loading StudioSpace...</p>
      </div>
    </main>
  );
}
