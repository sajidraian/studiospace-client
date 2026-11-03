import Link from "next/link";
import { Aperture } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const categories = [
  { name: "Photo Studios", value: "Photography" },
  { name: "Sound Stages", value: "Sound Stage" },
  { name: "Podcast Rooms", value: "Podcast" },
  { name: "Music Suites", value: "Music" },
  { name: "Art Workshops", value: "Art Workshop" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 pt-12 text-gray-900 transition-colors duration-300 dark:border-gray-800 dark:bg-[#171329] dark:text-white sm:px-6 sm:pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 pb-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:pb-14">
        {/* Brand & Social Links */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <Aperture
              size={30}
              className="shrink-0 text-violet-500 dark:text-violet-400"
            />

            <span className="text-2xl font-extrabold">
              Studio
              <span className="text-violet-500 dark:text-violet-400">
                Space
              </span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-gray-600 dark:text-gray-400 sm:mt-6">
            Empowering creators with inspiring spaces.
            Discover, connect and create something extraordinary.
          </p>

          <div className="mt-6 flex items-center gap-5">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-600 transition hover:text-violet-500 dark:text-gray-400 dark:hover:text-violet-400"
            >
              <FaFacebookF size={19} />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-600 transition hover:text-violet-500 dark:text-gray-400 dark:hover:text-violet-400"
            >
              <FaInstagram size={19} />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-600 transition hover:text-violet-500 dark:text-gray-400 dark:hover:text-violet-400"
            >
              <FaLinkedinIn size={19} />
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-xl font-bold text-gray-600 transition hover:text-violet-500 dark:text-gray-400 dark:hover:text-violet-400"
            >
              𝕏
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white sm:mb-6">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 sm:space-y-4">
            <li>
              <Link
                href="/"
                className="transition hover:text-violet-500 dark:hover:text-white"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/studios"
                className="transition hover:text-violet-500 dark:hover:text-white"
              >
                Explore Studios
              </Link>
            </li>

            <li>
              <Link
                href="/#how-it-works"
                className="transition hover:text-violet-500 dark:hover:text-white"
              >
                How It Works
              </Link>
            </li>

            <li>
              <Link
                href="/#about"
                className="transition hover:text-violet-500 dark:hover:text-white"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Studio Categories */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white sm:mb-6">
            Studio Categories
          </h3>

          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 sm:space-y-4">
            {categories.map((category) => (
              <li key={category.value}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category.value)}`}
                  className="transition hover:text-violet-500 dark:hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white sm:mb-6">
            Stay Inspired
          </h3>

          <p className="mb-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
            Get updates about creative spaces and new opportunities.
          </p>

          <form className="flex w-full overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
            <input
              type="email"
              placeholder="Your email address"
              aria-label="Your email address"
              className="w-full min-w-0 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-400"
            />

            <button
              type="button"
              className="shrink-0 bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 sm:px-5"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-500 dark:border-white/10 dark:text-gray-400 sm:py-7 sm:text-sm">
        © {new Date().getFullYear()} StudioSpace. All rights reserved.
      </div>
    </footer>
  );
}
