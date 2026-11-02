"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Users, ArrowRight, ImageOff } from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  maxCapacity: number;
  location: string;
  image: string;
  overview: string;
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchStudios = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/featured-studios",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch studios");
        }

        const result = await response.json();
        setStudios(
          Array.isArray(result.data) ? result.data : []
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error(err);
        setError("Studios could not be loaded. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStudios();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white px-4 py-14 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-orange-500 sm:text-sm">
              Discover Your Space
            </p>

            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Featured Creative Studios
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
              Explore inspiring spaces designed for your next creative project.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-600"
          >
            Explore All Studios
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Loading studios...
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-5 text-center text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400 sm:p-6 sm:text-base">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && studios.length === 0 && (
          <div className="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400 sm:p-10 sm:text-base">
            No studios available yet.
          </div>
        )}

        {/* Studio Cards */}
        {!loading && !error && studios.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="group min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Studio Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100 sm:h-56 lg:h-60 dark:bg-gray-800">
                  <img
                    src={
                      studio.image ||
                      "https://placehold.co/800x600?text=StudioSpace"
                    }
                    alt={`${studio.title} studio`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/800x600?text=Image+Unavailable";
                    }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Studio Information */}
                <div className="p-4 sm:p-5">
                  <span className="inline-block max-w-full rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    {studio.category}
                  </span>

                  <h3 className="mt-3 break-words text-lg font-bold text-gray-900 dark:text-white sm:mt-4 sm:text-xl">
                    {studio.title}
                  </h3>

                  <p className="mt-2 flex items-start gap-2 break-words text-sm text-gray-500 dark:text-gray-400">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{studio.location}</span>
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Users size={16} className="shrink-0" />
                    <span>Up to {studio.maxCapacity} people</span>
                  </p>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {studio.overview}
                  </p>

                  {/* Price and Details Button */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ৳{studio.hourlyRate}
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-400 sm:text-sm">
                        {" "}/ hour
                      </span>
                    </p>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 sm:px-4 sm:text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}