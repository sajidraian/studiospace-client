"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

type Studio = {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  maxCapacity: number;
  image: string;
  overview: string;
  rating?: number;
  reviewCount?: number;
};

const inputStyles =
  "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-violet-400";

const ITEMS_PER_PAGE = 9;

function StudiosContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [maxPrice, setMaxPrice] = useState("5000");
  const [currentPage, setCurrentPage] = useState(1);

  // Apply category from URL
  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    } else {
      setCategory("All Categories");
    }
  }, [selectedCategory]);

  // Fetch Studios from MongoDB through Next.js Proxy
  useEffect(() => {
    const controller = new AbortController();

    const fetchStudios = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/studios?page=1&limit=50",
          {
            signal: controller.signal,
            cache: "no-store",
          }
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

        console.error("Studio fetch error:", err);
        setError("Unable to load studios. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchStudios();

    return () => {
      controller.abort();
    };
  }, []);

  // Dynamic Categories
  const categories = useMemo(() => {
    return [
      "All Categories",
      ...new Set(
        studios
          .map((studio) => studio.category)
          .filter(Boolean)
      ),
    ];
  }, [studios]);

  // Dynamic Locations
  const locations = useMemo(() => {
    const cities = studios
      .map((studio) =>
        studio.location
          .split(",")
          .map((part) => part.trim())
      )
      .flat();

    return [
      "All Locations",
      ...new Set(cities.filter(Boolean)),
    ];
  }, [studios]);

  // Search and Filter
  const filteredStudios = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return studios.filter((studio) => {
      const matchesSearch =
        studio.title.toLowerCase().includes(searchTerm) ||
        (studio.overview || "").toLowerCase().includes(searchTerm) ||
        studio.category.toLowerCase().includes(searchTerm) ||
        studio.location.toLowerCase().includes(searchTerm);

      const matchesCategory =
        category === "All Categories" ||
        studio.category === category;

      const matchesLocation =
        location === "All Locations" ||
        studio.location
          .toLowerCase()
          .includes(location.toLowerCase());

      const matchesPrice =
        studio.hourlyRate <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesPrice
      );
    });
  }, [studios, search, category, location, maxPrice]);

  // Pagination
  const totalPages = Math.ceil(
    filteredStudios.length / ITEMS_PER_PAGE
  );

  const paginatedStudios = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredStudios.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredStudios, currentPage]);

  const startItem =
    filteredStudios.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endItem = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredStudios.length
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, location, maxPrice]);

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("All Locations");
    setMaxPrice("5000");
    setCurrentPage(1);
  };

  // Change Page
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-[#faf9ff] text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        {/* Page Header */}
        <section className="bg-[#171329] px-4 py-14 text-center text-white sm:px-6 sm:py-16 md:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-violet-400 sm:mb-4 sm:text-sm sm:tracking-[3px]">
            Find Your Creative Space
          </p>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Explore Creative Studios
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:mt-5 sm:text-base">
            Discover inspiring spaces, connect with creative hosts,
            and find the perfect studio for your next project.
          </p>
        </section>

        {/* Search and Filters */}
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900 sm:mb-10 sm:p-6">
            <div className="mb-5 flex items-center gap-2 sm:mb-6">
              <SlidersHorizontal
                size={21}
                className="shrink-0 text-violet-600 dark:text-violet-400"
              />

              <h2 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                Find Your Perfect Studio
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {/* Search */}
              <div className="relative min-w-0">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search studios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputStyles} pl-11 pr-4`}
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputStyles}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Location */}
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputStyles}
              >
                {locations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Price */}
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={inputStyles}
              >
                <option value="5000">Any Price (Max ৳5000)</option>
                <option value="1000">Up to ৳1000/hour</option>
                <option value="1500">Up to ৳1500/hour</option>
                <option value="2000">Up to ৳2000/hour</option>
                <option value="3000">Up to ৳3000/hour</option>
              </select>
            </div>
          </div>

          {/* Results Header */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-7 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                Available Studios
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Showing {startItem}-{endItem} of{" "}
                {filteredStudios.length} studios
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="w-fit rounded-lg border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950"
            >
              Clear Filters
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl bg-white py-16 text-center dark:bg-gray-900 sm:py-20">
              <p className="text-base font-semibold text-violet-600 dark:text-violet-400 sm:text-lg">
                Loading Studios...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400 sm:p-10 sm:text-base">
              {error}
            </div>
          )}

          {/* Studio Cards */}
          {!loading && !error && filteredStudios.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                {paginatedStudios.map((studio) => (
                  <div
                    key={studio._id}
                    className="group min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800 sm:h-56 lg:h-60">
                      <Image
                        src={studio.image}
                        alt={studio.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />

                      <span className="absolute left-3 top-3 max-w-[calc(100%-24px)] truncate rounded-full bg-white px-3 py-2 text-xs font-bold text-violet-700 shadow-sm dark:bg-gray-950 dark:text-violet-300 sm:left-4 sm:top-4 sm:px-4">
                        {studio.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="break-words text-lg font-bold text-gray-900 transition group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 sm:text-xl">
                        {studio.title}
                      </h3>

                      <div className="mt-3 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-violet-500"
                        />

                        <span className="break-words">
                          {studio.location}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Up to {studio.maxCapacity} people</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          <span aria-hidden="true">★</span>
                          {studio.reviewCount && studio.reviewCount > 0
                            ? `${Number(studio.rating || 0).toFixed(1)} (${studio.reviewCount} ${studio.reviewCount === 1 ? "review" : "reviews"})`
                            : "New · No reviews yet"}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {studio.overview}
                      </p>

                      {/* Price and Details */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-700 sm:pt-5">
                        <div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Starting from
                          </p>

                          <p className="mt-1 text-lg font-extrabold text-violet-700 dark:text-violet-400 sm:text-xl">
                            ৳{studio.hourlyRate}

                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                              /hour
                            </span>
                          </p>
                        </div>

                        <Link
                          href={`/studios/${studio._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 sm:px-4 sm:py-3 sm:text-sm"
                        >
                          View Details
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Studio pagination"
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                >
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition hover:border-violet-500 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-500"
                  >
                    <ChevronLeft size={17} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={
                        currentPage === page ? "page" : undefined
                      }
                      className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition ${
                        currentPage === page
                          ? "bg-violet-600 text-white shadow-md"
                          : "border border-gray-200 text-gray-700 hover:border-violet-500 hover:text-violet-600 dark:border-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition hover:border-violet-500 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-500"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={17} />
                  </button>
                </nav>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && filteredStudios.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-6 sm:py-20">
              <Search
                size={40}
                className="mx-auto mb-5 text-gray-300 dark:text-gray-600 sm:h-12 sm:w-12"
              />

              <h3 className="text-lg font-bold text-gray-800 dark:text-white sm:text-xl">
                No Studios Found
              </h3>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 sm:px-6 sm:text-base"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          Loading studios...
        </div>
      }
    >
      <StudiosContent />
    </Suspense>
  );
}