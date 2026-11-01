"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Aperture,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const user = session?.user;

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("studiospace-theme");

    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);

    setThemeLoaded(true);
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);

    localStorage.setItem(
      "studiospace-theme",
      newTheme ? "dark" : "light"
    );
  };

  // Close menus after navigation
  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Active Navigation Link
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/studios") {
      return pathname === "/studios" || pathname.startsWith("/studios/");
    }

    return false;
  };

  const navLinkClass = (href: string) =>
    `text-sm font-semibold transition-colors ${
      isActive(href)
        ? "text-violet-600"
        : "text-gray-700 hover:text-violet-600 dark:text-gray-300"
    }`;

  // Logout
  const handleLogout = async () => {
    try {
      await authClient.signOut();

      toast.success("Logged out successfully!");

      closeMenus();

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed!");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        darkMode
          ? "border-gray-800 bg-gray-950/95 text-white"
          : "border-gray-100 bg-white/95 text-gray-900"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2"
        >
          <Aperture
            size={27}
            className="text-violet-600 sm:h-8 sm:w-8"
          />

          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Studio<span className="text-violet-600">Space</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:gap-8 md:flex">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link href="/studios" className={navLinkClass("/studios")}>
            Explore Studios
          </Link>

          <Link
            href="/#how-it-works"
            className="text-sm font-semibold text-gray-700 transition hover:text-violet-600 dark:text-gray-300"
          >
            How It Works
          </Link>

          <Link
            href="/#about"
            className="text-sm font-semibold text-gray-700 transition hover:text-violet-600 dark:text-gray-300"
          >
            About Us
          </Link>
        </div>

        {/* Desktop Authentication and Theme */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Theme Toggle */}
          {themeLoaded && (
            <button
              onClick={toggleTheme}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              title={darkMode ? "Light Mode" : "Dark Mode"}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {darkMode ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          )}

          {/* Logged Out */}
          {!isPending && !user && (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Logged In User */}
          {!isPending && user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-label="Open user menu"
                className={`flex items-center gap-2 rounded-full border p-1.5 pr-3 transition ${
                  darkMode
                    ? "border-gray-700 hover:bg-gray-800"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border shadow-xl ${
                    darkMode
                      ? "border-gray-700 bg-gray-900 text-white"
                      : "border-gray-100 bg-white text-gray-900"
                  }`}
                >
                  <div
                    className={`border-b px-5 py-4 ${
                      darkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <p className="font-bold">{user.name}</p>

                    <p className="truncate text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/add-studio"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                    >
                      <PlusCircle size={18} />
                      Add New Studio
                    </Link>

                    <Link
                      href="/dashboard/my-listings"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                    >
                      <Building2 size={18} />
                      My Studio Listings
                    </Link>

                    <Link
                      href="/dashboard/my-bookings"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                    >
                      <CalendarDays size={18} />
                      My Bookings
                    </Link>
                  </div>

                  <div
                    className={`border-t p-2 ${
                      darkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          className={`border-t px-4 py-5 sm:px-6 md:hidden ${
            darkMode
              ? "border-gray-800 bg-gray-950 text-white"
              : "border-gray-100 bg-white text-gray-900"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4">

            {/* Main Links */}
            <Link
              href="/"
              onClick={closeMenus}
              className={navLinkClass("/")}
            >
              Home
            </Link>

            <Link
              href="/studios"
              onClick={closeMenus}
              className={navLinkClass("/studios")}
            >
              Explore Studios
            </Link>

            <Link
              href="/#how-it-works"
              onClick={closeMenus}
              className="text-sm font-semibold text-gray-700 hover:text-violet-600 dark:text-gray-300"
            >
              How It Works
            </Link>

            <Link
              href="/#about"
              onClick={closeMenus}
              className="text-sm font-semibold text-gray-700 hover:text-violet-600 dark:text-gray-300"
            >
              About Us
            </Link>

            <div
              className={`my-1 border-t ${
                darkMode ? "border-gray-800" : "border-gray-100"
              }`}
            />

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                darkMode
                  ? "border-gray-700 hover:bg-gray-800"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {darkMode ? (
                <>
                  <Sun size={19} className="text-yellow-400" />
                  Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon size={19} />
                  Switch to Dark Mode
                </>
              )}
            </button>

            {/* Logged Out Mobile */}
            {!isPending && !user && (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold dark:border-gray-700"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Logged In Mobile */}
            {!isPending && user && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-3 rounded-xl bg-violet-50 p-3 dark:bg-gray-800">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/add-studio"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                >
                  <PlusCircle size={18} />
                  Add New Studio
                </Link>

                <Link
                  href="/dashboard/my-listings"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                >
                  <Building2 size={18} />
                  My Studio Listings
                </Link>

                <Link
                  href="/dashboard/my-bookings"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-gray-800"
                >
                  <CalendarDays size={18} />
                  My Bookings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}