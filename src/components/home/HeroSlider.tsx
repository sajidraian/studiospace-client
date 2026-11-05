"use client";

import Link from "next/link";
import { ArrowRight, Camera, Music } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    badge: "✦ A creative space for every vision",
    title: "Find Your Space.",
    highlight: "Create Something",
    ending: "Extraordinary.",
    description:
      "Discover inspiring photography studios, podcast rooms, music suites and creative workspaces. Your next big idea starts here.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
    imageAlt: "Modern creative workspace",
    icon: Camera,
    spaces: "400+ Studios",
    label: "Creative spaces",
  },
  {
    badge: "✦ Your ideas deserve the perfect studio",
    title: "Make Every Shot.",
    highlight: "A Masterpiece",
    ending: "Worth Sharing.",
    description:
      "Find professional photography studios with beautiful backdrops, lighting equipment and everything you need to create.",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200",
    imageAlt: "Professional photography studio",
    icon: Camera,
    spaces: "120+ Studios",
    label: "Photography spaces",
  },
  {
    badge: "✦ Bring your sound to life",
    title: "Create Your Sound.",
    highlight: "Record Your",
    ending: "Next Hit.",
    description:
      "Explore inspiring podcast rooms and music studios designed for recording, producing and sharing your creativity.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200",
    imageAlt: "Professional music recording studio",
    icon: Music,
    spaces: "150+ Studios",
    label: "Audio production spaces",
  },
];

export default function HeroSlider() {
  return (
    <section
      aria-label="Featured creative spaces"
      className="relative overflow-hidden bg-[#171329] text-white"
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        speed={800}
        className="studio-hero-swiper"
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;

          return (
            <SwiperSlide key={slide.title}>
              <div className="px-4 pb-16 pt-12 sm:px-6 sm:py-20 lg:py-28">
                <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-12">

                  {/* Hero Content */}
                  <div className="min-w-0">
                    <span className="mb-5 inline-block max-w-full rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-2 text-xs leading-5 text-violet-300 sm:mb-6 sm:px-4 sm:text-sm">
                      {slide.badge}
                    </span>

                    <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                      {slide.title}

                      <span className="block text-violet-400">
                        {slide.highlight}
                      </span>

                      {slide.ending}
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
                      {slide.description}
                    </p>

                    {/* Buttons */}
                    <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
                      <Link
                        href="/studios"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3.5 text-sm font-semibold transition hover:bg-violet-700 sm:px-7 sm:py-4 sm:text-base"
                      >
                        Explore Studios
                        <ArrowRight size={18} />
                      </Link>

                      <Link
                        href="/studios"
                        className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold transition hover:bg-white hover:text-black sm:px-7 sm:py-4 sm:text-base"
                      >
                        Host Your Space
                      </Link>
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="relative min-w-0 pb-7 sm:pb-8">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl sm:rounded-3xl sm:p-3">
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        decoding="async"
                        className="h-56 w-full rounded-xl object-cover transition-opacity duration-300 sm:h-80 sm:rounded-2xl md:h-[380px] lg:h-[450px]"
                      />
                    </div>

                    {/* Studio Info Card */}
                    <div className="absolute bottom-0 left-3 flex max-w-[calc(100%-24px)] items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-gray-900 shadow-xl transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:left-5 sm:gap-4 sm:rounded-2xl sm:p-4 md:-left-5 md:p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 sm:h-12 sm:w-12 sm:rounded-xl">
                        <Icon size={23} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                          {slide.label}
                        </p>

                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white sm:text-xl md:text-2xl">
                          {slide.spaces}
                        </h3>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .studio-hero-swiper .swiper-button-next,
        .studio-hero-swiper .swiper-button-prev {
          color: white;
          background: rgba(139, 92, 246, 0.7);
          width: 42px;
          height: 42px;
          border-radius: 50%;
        }

        .studio-hero-swiper .swiper-button-next::after,
        .studio-hero-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }

        .studio-hero-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.5;
        }

        .studio-hero-swiper .swiper-pagination-bullet-active {
          background: #a78bfa;
          opacity: 1;
        }

        .studio-hero-swiper .swiper-pagination {
          bottom: 12px !important;
        }

        @media (max-width: 640px) {
          .studio-hero-swiper .swiper-button-next,
          .studio-hero-swiper .swiper-button-prev {
            display: none;
          }

          .studio-hero-swiper .swiper-pagination {
            bottom: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}