import FeaturedStudios from "@/components/home/FeaturedStudios";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import HeroSlider from "@/components/home/HeroSlider";
import {
  ArrowRight,
  Camera,
  Mic2,
  Music,
  Palette,
  Film,
  ShieldCheck,
  Search,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Photo Studios", value: "Photography", icon: Camera, count: "120+ Spaces" },
  { name: "Sound Stages", value: "Sound Stage", icon: Film, count: "85+ Spaces" },
  { name: "Podcast Rooms", value: "Podcast", icon: Mic2, count: "64+ Spaces" },
  { name: "Music Suites", value: "Music", icon: Music, count: "92+ Spaces" },
  { name: "Art Workshops", value: "Art Workshop", icon: Palette, count: "48+ Spaces" },
];

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description: "Explore unique creative studios that match your vision.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description: "Choose your preferred date and working hours.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Book Instantly",
    description: "Reserve your favorite creative space with ease.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "Create & Produce",
    description: "Bring your creative ideas to life.",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        {/* Hero Section */}
        <HeroSlider />

        {/* Featured Studios */}
        <FeaturedStudios />

        {/* Categories */}
        <section className="bg-white px-4 py-14 dark:bg-gray-950 sm:px-6 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 text-center sm:mb-12">
              <p className="text-sm font-semibold tracking-wider text-violet-600">
                EXPLORE SPACES
              </p>

              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                Find Your Creative Environment
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
                Discover the perfect space for your next project.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link
                    href={`/studios?category=${encodeURIComponent(category.value)}`}
                    key={category.name}
                    aria-label={`Explore ${category.name} - ${category.count}`}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:p-7 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-500 dark:focus-visible:ring-offset-gray-950"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white sm:mb-6 sm:h-14 sm:w-14 sm:rounded-2xl dark:bg-violet-950 dark:text-violet-400 dark:group-hover:bg-violet-600 dark:group-hover:text-white">
                      <Icon size={26} />
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {category.count}
                    </p>

                    <ArrowRight
                      className="mt-4 text-violet-600 transition group-hover:translate-x-2 sm:mt-5"
                      size={20}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="bg-gray-50 px-4 py-14 dark:bg-gray-900 sm:px-6 sm:py-20 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 text-center sm:mb-14">
              <p className="text-sm font-semibold tracking-wider text-violet-600">
                SIMPLE PROCESS
              </p>

              <h2 className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                How StudioSpace Works
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="rounded-2xl border border-transparent bg-white p-5 shadow-sm transition hover:shadow-lg sm:p-7 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <div className="flex items-center justify-between">
                      <Icon size={30} className="text-violet-600" />

                      <span className="text-3xl font-extrabold text-gray-200 dark:text-gray-700">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-gray-900 sm:mt-8 sm:text-xl dark:text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Host Guarantee */}
        <section
          id="about"
          className="bg-white px-4 py-14 dark:bg-gray-950 sm:px-6 sm:py-20 lg:py-24"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-9 sm:gap-12 md:grid-cols-2">
            {/* Content */}
            <div>
              <p className="text-sm font-semibold tracking-wider text-violet-600">
                BUILT FOR CREATORS
              </p>

              <h2 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
                Create With Confidence.
                <span className="text-violet-600">
                  {" "}We Have Your Back.
                </span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-500 sm:mt-6 sm:text-base sm:leading-8 dark:text-gray-400">
                StudioSpace connects creative professionals with trusted
                studio hosts. We make discovering and booking creative
                spaces simple and convenient.
              </p>

              <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                {[
                  "Verified host profiles",
                  "Transparent pricing",
                  "Equipment and space safety",
                  "Liability protection guidance",
                  "24/7 host support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <ShieldCheck
                      size={21}
                      className="shrink-0 text-violet-600"
                    />

                    <span className="text-sm font-semibold text-gray-800 sm:text-base dark:text-gray-200">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/studios"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 sm:mt-9 sm:px-7 sm:py-4 sm:text-base"
              >
                Start Exploring
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Image */}
            <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1000"
                alt="Creative workspace interior"
                className="h-64 w-full object-cover sm:h-80 md:h-[380px] lg:h-[450px]"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}