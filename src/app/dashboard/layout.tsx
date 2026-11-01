"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import {
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  Home,
  Aperture,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(path);
  };

  const navClass = (path: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
      isActive(path)
        ? "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
        : "text-gray-600 hover:bg-violet-50 hover:text-violet-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-violet-400"
    }`;

  const isMyBookings = pathname === "/dashboard/my-bookings";

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600 dark:border-gray-700 dark:border-t-violet-400" />

          <p className="text-lg font-semibold text-violet-600 dark:text-violet-400">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 border-r border-gray-200 bg-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800 md:block">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 border-b border-gray-100 px-6 py-6 dark:border-gray-700"
        >
          <Aperture
            size={30}
            className="text-violet-600 dark:text-violet-400"
          />

          <span className="text-xl font-extrabold text-gray-900 dark:text-white">
            Studio
            <span className="text-violet-600 dark:text-violet-400">
              Space
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2 px-4 py-6">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Dashboard Menu
          </p>

          <Link href="/dashboard" className={navClass("/dashboard")}>
            <LayoutDashboard size={20} />
            Overview
          </Link>

          <Link
            href="/dashboard/add-studio"
            className={navClass("/dashboard/add-studio")}
          >
            <PlusCircle size={20} />
            Add New Studio
          </Link>

          <Link
            href="/dashboard/my-listings"
            className={navClass("/dashboard/my-listings")}
          >
            <Building2 size={20} />
            My Studio Listings
          </Link>

          <Link
            href="/dashboard/my-bookings"
            className={navClass("/dashboard/my-bookings")}
          >
            <CalendarDays size={20} />
            My Bookings
          </Link>

          <div className="my-6 border-t border-gray-100 dark:border-gray-700" />

          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Home size={20} />
            Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900 md:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            StudioSpace Dashboard
          </h1>

          <Link
            href="/"
            className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-400 dark:hover:bg-violet-900"
          >
            Visit Website
          </Link>
        </header>

        {/* Page Content */}
     <div
  className={`min-h-[calc(100vh-64px)] w-full transition-colors duration-300 ${
    isMyBookings
      ? "bg-gray-50 dark:bg-gray-900 p-0"
      : "bg-gray-50 dark:bg-gray-950 p-6 md:p-8"
  }`}
>
  {children}
</div>
      </main>
    </div>
  );
}