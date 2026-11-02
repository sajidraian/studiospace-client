import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-5">
      <div className="w-full max-w-xl text-center">
        {/* 404 Illustration */}
        <div className="relative">
          <h1 className="text-[130px] font-extrabold leading-none tracking-tighter text-violet-100 sm:text-[180px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-2xl bg-violet-600 p-5 text-white shadow-xl shadow-violet-200">
              <Search size={42} />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Page Not Found!
        </h2>

        <p className="mx-auto mt-4 max-w-md text-gray-500 leading-7">
          Oops! The creative space you are looking for doesn't exist
          or may have been moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-violet-700"
          >
            <Home size={19} />
            Back to Home
          </Link>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-6 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            <ArrowLeft size={19} />
            Explore Studios
          </Link>
        </div>

        {/* Branding */}
        <p className="mt-12 text-sm font-semibold text-violet-500">
          StudioSpace — Where Creativity Finds Space.
        </p>
      </div>
    </main>
  );
}