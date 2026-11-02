"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  MapPin,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Studio = {
  _id: string;
  title: string;
  location: string;
  image?: string;
};

type Booking = {
  _id: string;
  studioTitle?: string;
  studioName?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  totalPrice?: number;
  status: string;
  location?: string;
};

export default function DashboardPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const [studioResponse, bookingResponse] = await Promise.all([
          fetch(`${API_URL}/api/my-studios`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/my-bookings`, {
            credentials: "include",
          }),
        ]);

        const studioResult = await studioResponse.json();
        const bookingResult = await bookingResponse.json();

        if (studioResponse.ok) {
          setStudios(
            Array.isArray(studioResult.data) ? studioResult.data : []
          );
        }

        if (bookingResponse.ok) {
          setBookings(
            Array.isArray(bookingResult.data) ? bookingResult.data : []
          );
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "confirmed"
  );

  const statistics = [
    {
      title: "My Studio Listings",
      value: studios.length,
      icon: Building2,
      color:
        "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
      description: "Total studios listed",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarCheck,
      color:
        "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
      description: "Your booking requests",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings.length,
      icon: Clock,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
      description: "Waiting for confirmation",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings.length,
      icon: CheckCircle,
      color:
        "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
      description: "Successfully confirmed",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <Loader2
            className="mx-auto animate-spin text-violet-600 dark:text-violet-400"
            size={36}
          />

          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 space-y-6 overflow-x-clip bg-gray-50 p-3 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100 sm:space-y-8 sm:p-5 lg:p-8">
      {/* Welcome Section */}
      <div className="flex min-w-0 flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
            Dashboard Overview
          </p>

          <h2 className="mt-2 break-words text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            Welcome to Your Dashboard!
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
            Manage your studios and bookings from one place.
          </p>
        </div>

        <Link
          href="/dashboard/add-studio"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 sm:w-auto sm:text-base"
        >
          <Plus size={19} />
          Add New Studio
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${item.color}`}
                >
                  <Icon size={23} />
                </div>

                <span className="break-all text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
                  {item.value}
                </span>
              </div>

              <h3 className="mt-4 break-words font-bold text-gray-800 dark:text-gray-100 sm:mt-5">
                {item.title}
              </h3>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="min-w-0">
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl">
          Quick Actions
        </h3>

        <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {/* Add New Studio */}
          <Link
            href="/dashboard/add-studio"
            className="group min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-700 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                <Plus size={23} />
              </div>

              <ArrowRight
                size={20}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-violet-600 dark:group-hover:text-violet-400"
              />
            </div>

            <h4 className="mt-5 font-bold text-gray-900 dark:text-white">
              Add New Studio
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Share your creative workspace with others.
            </p>
          </Link>

          {/* My Studio Listings */}
          <Link
            href="/dashboard/my-listings"
            className="group min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-700 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Building2 size={23} />
              </div>

              <ArrowRight
                size={20}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-violet-600 dark:group-hover:text-violet-400"
              />
            </div>

            <h4 className="mt-5 font-bold text-gray-900 dark:text-white">
              My Studio Listings
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              View and manage your studio listings.
            </p>
          </Link>

          {/* My Bookings */}
          <Link
            href="/dashboard/my-bookings"
            className="group min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-700 sm:col-span-2 sm:p-6 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-950 dark:text-green-400">
                <CalendarCheck size={23} />
              </div>

              <ArrowRight
                size={20}
                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-violet-600 dark:group-hover:text-violet-400"
              />
            </div>

            <h4 className="mt-5 font-bold text-gray-900 dark:text-white">
              My Bookings
            </h4>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Track your booking requests and status.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 md:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl">
              Recent Bookings
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Your latest booking activities.
            </p>
          </div>

          <Link
            href="/dashboard/my-bookings"
            className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
          >
            View All
            <ArrowRight size={17} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-10 text-center sm:py-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-500 dark:bg-violet-950 dark:text-violet-400 sm:h-16 sm:w-16">
              <CalendarCheck size={28} />
            </div>

            <h4 className="mt-4 font-bold text-gray-800 dark:text-white">
              No Bookings Yet
            </h4>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your booking activities will appear here.
            </p>

            <Link
              href="/studios"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Explore Studios
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id}
                className="flex min-w-0 flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 transition-colors dark:border-gray-800 dark:bg-gray-950/50 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0">
                  <h4 className="break-words font-bold text-gray-800 dark:text-gray-100">
                    {booking.studioTitle ||
                      booking.studioName ||
                      "Studio Booking"}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                    {booking.bookingDate && (
                      <span className="flex items-center gap-1">
                        <CalendarCheck size={14} className="shrink-0" />
                        {booking.bookingDate}
                      </span>
                    )}

                    {booking.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="shrink-0" />
                        <span className="break-words">
                          {booking.location}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      booking.status?.toLowerCase() === "confirmed"
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : booking.status?.toLowerCase() === "cancelled"
                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                    }`}
                  >
                    {booking.status}
                  </span>

                  <span className="font-bold text-gray-900 dark:text-white">
                    ৳{booking.totalPrice ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Studio Summary */}
      <div className="min-w-0 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-white shadow-md sm:p-7 md:p-9">
        <div className="flex min-w-0 flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0">
            <h3 className="break-words text-xl font-extrabold sm:text-2xl">
              Your Creative Journey Starts Here!
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">
              Manage your creative spaces, connect with creators, and make
              every booking experience better with StudioSpace.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50 sm:w-auto sm:text-base"
          >
            Explore Studios
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}