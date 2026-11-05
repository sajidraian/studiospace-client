import Link from "next/link";
import { Home, ArrowLeft, Camera, Aperture, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-5 py-12 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <div className="w-full max-w-xl text-center">
        {/* Creative Studio Illustration */}
        <div className="relative mx-auto flex h-64 max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-indigo-100 shadow-inner dark:border-violet-900/60 dark:from-violet-950 dark:via-gray-900 dark:to-indigo-950">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-violet-300/40 blur-2xl dark:bg-violet-700/20" />
          <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-indigo-300/40 blur-2xl dark:bg-indigo-700/20" />
          <div className="absolute bottom-8 h-2 w-56 rounded-full bg-violet-300/70 dark:bg-violet-800/70" />
          <div className="relative flex h-32 w-40 items-center justify-center rounded-3xl border-4 border-violet-300 bg-white shadow-xl dark:border-violet-700 dark:bg-gray-800">
            <div className="absolute -top-5 left-5 h-5 w-12 rounded-t-lg bg-violet-300 dark:bg-violet-700" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300">
              <Camera size={42} />
            </div>
            <Aperture className="absolute -right-9 -top-8 text-violet-500 dark:text-violet-300" size={34} />
          </div>
          <Sparkles className="absolute left-12 top-10 text-amber-500" size={25} />
          <Sparkles className="absolute bottom-12 right-12 text-violet-500 dark:text-violet-300" size={20} />
          <span className="absolute bottom-3 right-4 text-4xl font-black tracking-tight text-violet-200 dark:text-violet-900">
            404
          </span>
        </div>

        <h1 className="mt-8 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Creative Space Not Found
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-gray-500 dark:text-gray-400">
          Looks like this page has gone off set. The creative space you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-violet-700"
          >
            <Home size={19} /> Return to Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-6 py-3 font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-violet-800 dark:bg-gray-900 dark:text-violet-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={19} /> Explore Studios
          </Link>
        </div>

        <p className="mt-12 text-sm font-semibold text-violet-500 dark:text-violet-400">
          StudioSpace — Where Creativity Finds Space.
        </p>
      </div>
    </main>
  );
}
