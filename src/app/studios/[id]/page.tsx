"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  ArrowLeft,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle,
  X,
  CalendarDays,
  Images,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  galleryImages?: string[];
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  rating?: number;
  reviewCount?: number;
};

type Review = {
  _id?: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type EligibleBooking = {
  _id: string;
  bookingDate: string;
  studioTitle: string;
};

const inputStyles =
  "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-violet-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-violet-400";

export default function StudioDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const { data: session, isPending: sessionLoading } = useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [eligibleBookings, setEligibleBookings] = useState<EligibleBooking[]>([]);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [hours, setHours] = useState("2");
  const [guests, setGuests] = useState("2");
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch Studio Details
  useEffect(() => {
    const fetchStudio = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/studios/${id}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch studio");
        }

        setStudio(result.data);
      } catch (err) {
        console.error("Studio details error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load studio details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [id]);

  // Fetch studio reviews and eligible completed bookings
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/studios/${id}/reviews`, { cache: "no-store" });
        const result = await response.json();
        if (response.ok && Array.isArray(result.data)) setReviews(result.data);
      } catch (err) {
        console.error("Review fetch error:", err);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (sessionLoading || !session?.user) return;

    const fetchEligibleBookings = async () => {
      try {
        const response = await fetch("/api/my-bookings?limit=50", {
          credentials: "include",
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.data)) return;

        const today = new Date().toISOString().slice(0, 10);
        const eligible = result.data.filter((booking: any) =>
          booking.studioId === id &&
          booking.status === "Confirmed" &&
          typeof booking.bookingDate === "string" &&
          booking.bookingDate < today
        );
        setEligibleBookings(eligible);
        if (eligible.length) setSelectedReviewBooking(eligible[0]._id);
      } catch (err) {
        console.error("Eligible booking fetch error:", err);
      }
    };

    fetchEligibleBookings();
  }, [id, session?.user, sessionLoading]);

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedReviewBooking) return;

    setReviewLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedReviewBooking,
          rating: Number(reviewRating),
          comment: reviewComment,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not submit review.");

      toast.success(result.message || "Review submitted successfully!");
      setReviewComment("");

      const [reviewResponse, studioResponse] = await Promise.all([
        fetch(`/api/studios/${id}/reviews`, { cache: "no-store" }),
        fetch(`/api/studios/${id}`, { cache: "no-store" }),
      ]);
      const [reviewResult, studioResult] = await Promise.all([
        reviewResponse.json(),
        studioResponse.json(),
      ]);
      if (Array.isArray(reviewResult.data)) setReviews(reviewResult.data);
      if (studioResult.data) setStudio(studioResult.data);
      setEligibleBookings((previous) => previous.filter((booking) => booking._id !== selectedReviewBooking));
      setSelectedReviewBooking("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Review submission failed.");
    } finally {
      setReviewLoading(false);
    }
  };

  // Close Lightbox with Escape Key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);

        if (!bookingLoading) {
          setBookingOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [bookingLoading]);

  // Calculate End Time
  const calculateEndTime = () => {
    if (!startTime) return "";

    const [hour, minute] = startTime.split(":").map(Number);
    const totalMinutes = hour * 60 + minute + Number(hours) * 60;

    if (totalMinutes > 24 * 60 - 1) return "";

    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;

    return `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;
  };

  const endTime = calculateEndTime();

  // Price Calculation
  const totalPrice = studio
    ? studio.hourlyRate * Number(hours)
    : 0;

  const grandTotal = studio
    ? totalPrice + studio.securityDeposit
    : 0;

  // Booking Handler
  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login before booking a studio.");
      router.push("/login");
      return;
    }

    if (!studio) return;

    if (studio.ownerEmail === session.user.email) {
      toast.error("You cannot book your own studio.");
      return;
    }

    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please select a valid booking date and time.");
      return;
    }

    if (Number(guests) < 1 || Number(guests) > studio.maxCapacity) {
      toast.error(
        `Guest count must be between 1 and ${studio.maxCapacity}.`
      );
      return;
    }

    const selectedDate = new Date(`${bookingDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Please select a future booking date.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId: studio._id,
          bookingDate,
          startTime,
          endTime,
          guests: Number(guests),
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit booking request."
        );
      }

      toast.success("Booking request submitted successfully!");

      setBookingOpen(false);
      setBookingDate("");
      setStartTime("");
      setHours("2");
      setGuests("2");
      setNotes("");

      router.push("/dashboard/my-bookings");
    } catch (err) {
      console.error("Booking error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong while booking."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading State
  if (loading || sessionLoading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center bg-[#faf9ff] px-4 dark:bg-gray-950">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

            <p className="mt-5 text-base font-semibold text-violet-600 dark:text-violet-400 sm:text-lg">
              Loading Studio Details...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // Error State
  if (error || !studio) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf9ff] px-4 text-center dark:bg-gray-950">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Studio Not Found
          </h1>

          <p className="mt-3 max-w-md text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            {error || "The studio you are looking for does not exist."}
          </p>

          <Link
            href="/studios"
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 sm:text-base"
          >
            Explore Studios
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  // Clean Gallery Images
  const galleryImages = (studio.galleryImages || []).filter(
    (image) => typeof image === "string" && image.trim() !== ""
  );

  const allImages = [studio.image, ...galleryImages].filter(Boolean);

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-[#faf9ff] text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        {/* Breadcrumb */}
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
          >
            <ArrowLeft size={18} />
            Back to Studios
          </Link>
        </section>

        {/* Studio Header */}
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                {studio.category}
              </span>

              <h1 className="mt-4 break-words text-2xl font-extrabold text-gray-900 dark:text-white sm:mt-5 sm:text-3xl md:text-4xl">
                {studio.title}
              </h1>

              <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <span className="flex items-start gap-2">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-violet-500"
                  />
                  <span className="break-words">{studio.location}</span>
                </span>

                <span className="flex items-center gap-1">
                  <Star size={17} className="fill-yellow-400 text-yellow-400" />
                  {studio.reviewCount && studio.reviewCount > 0
                    ? `${Number(studio.rating || 0).toFixed(1)} · ${studio.reviewCount} ${studio.reviewCount === 1 ? "review" : "reviews"}`
                    : "New · No reviews yet"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Studio Gallery Carousel */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-label="Studio photo gallery">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-4 sm:gap-4">
            {[studio.image, ...galleryImages].map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`Open studio photo ${index + 1}`}
                className="group relative h-56 min-w-[85%] snap-center overflow-hidden rounded-2xl text-left sm:h-80 sm:min-w-[60%] md:h-[420px] md:min-w-[48%]"
              >
                <Image
                  src={image}
                  alt={index === 0 ? studio.title : `${studio.title} gallery ${index}`}
                  fill
                  unoptimized
                  priority={index === 0}
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 48vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                {index === 0 && (
                  <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-2 text-xs font-semibold text-white sm:bottom-4 sm:left-4 sm:px-4 sm:text-sm">
                    Main Studio Image
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-1 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <Images size={17} className="shrink-0 text-violet-600 dark:text-violet-400" />
              {galleryImages.length + 1} Photos Available
            </span>
            <span>Swipe or scroll to explore</span>
          </div>
        </section>

        {/* Main Details */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-3 lg:gap-10">
          <div className="min-w-0 space-y-8 sm:space-y-10 lg:col-span-2">
            {/* Overview */}
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                About This Studio
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300 sm:mt-5 sm:text-base sm:leading-8">
                {studio.overview}
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                Studio Information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-5">
                {[
                  {
                    icon: Clock,
                    label: "Hourly Rate",
                    value: `৳${studio.hourlyRate}/hour`,
                  },
                  {
                    icon: ShieldCheck,
                    label: "Security Deposit",
                    value: `৳${studio.securityDeposit}`,
                  },
                  {
                    icon: Users,
                    label: "Maximum Capacity",
                    value: `${studio.maxCapacity} People`,
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: studio.location,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-w-0 items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-colors dark:border dark:border-gray-800 dark:bg-gray-900 sm:gap-4 sm:p-5"
                    >
                      <Icon
                        className="shrink-0 text-violet-600 dark:text-violet-400"
                        size={28}
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                          {item.label}
                        </p>

                        <p className="break-words text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                Amenities & Facilities
              </h2>

              {studio.amenities?.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                  {studio.amenities.map((amenity, index) => (
                    <div
                      key={`${amenity}-${index}`}
                      className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300 sm:text-base"
                    >
                      <CheckCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                      />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                  No amenities information available.
                </p>
              )}
            </div>

            {/* Host */}
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                Meet Your Host
              </h2>

              <div className="mt-5 flex min-w-0 items-center gap-3 rounded-2xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 sm:mt-6 sm:gap-5 sm:p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xl font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300 sm:h-16 sm:w-16 sm:text-2xl">
                  {studio.ownerName
                    ? studio.ownerName.charAt(0).toUpperCase()
                    : "H"}
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                    {studio.ownerName || "Studio Host"}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    Studio Host
                  </p>

                  <p className="mt-1 break-all text-xs text-gray-400 dark:text-gray-500">
                    {studio.ownerEmail}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 sm:text-sm">
                    <ShieldCheck size={15} />
                    Studio Host
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                  Guest Reviews
                </h2>
                <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm dark:bg-gray-900">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900 dark:text-white">
                    {reviews.length ? (studio.rating ?? 0).toFixed(1) : "New"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>

              {eligibleBookings.length > 0 && (
                <form onSubmit={handleReviewSubmit} className="mt-5 space-y-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm dark:border-violet-900 dark:bg-gray-900">
                  <h3 className="font-bold text-gray-900 dark:text-white">Share your experience</h3>
                  {eligibleBookings.length > 1 && (
                    <select value={selectedReviewBooking} onChange={(event) => setSelectedReviewBooking(event.target.value)} className={inputStyles} required>
                      {eligibleBookings.map((booking) => (
                        <option key={booking._id} value={booking._id}>
                          Booking on {booking.bookingDate}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <label htmlFor="review-rating" className="text-sm font-medium text-gray-700 dark:text-gray-300">Your rating</label>
                    <select id="review-rating" value={reviewRating} onChange={(event) => setReviewRating(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950" required>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} maxLength={1000} rows={3} placeholder="Tell others about your experience (optional)" className={inputStyles} />
                  <button type="submit" disabled={reviewLoading || !selectedReviewBooking} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {reviews.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {reviews.map((review, index) => (
                    <article key={review._id || index} className="rounded-2xl bg-white p-5 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{review.reviewerName}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star key={index} size={15} className={index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                      {review.comment && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-300">{review.comment}</p>}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900 sm:p-8">
                  <Star size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 sm:text-base">No Reviews Yet</h3>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {eligibleBookings.length ? "You can be the first to review this studio." : "Reviews from guests with past confirmed bookings will appear here."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <aside className="min-w-0">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-7 lg:sticky lg:top-28">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Starting from
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-violet-700 dark:text-violet-400 sm:text-3xl">
                ৳{studio.hourlyRate}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 sm:text-base">
                  /hour
                </span>
              </h2>

              <div className="my-5 space-y-4 border-y border-gray-100 py-5 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300 sm:my-6 sm:py-6">
                <div className="flex items-center justify-between gap-3">
                  <span>Security Deposit</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    ৳{studio.securityDeposit}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Maximum Capacity</span>
                  <span className="text-right font-bold text-gray-900 dark:text-white">
                    {studio.maxCapacity} People
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Category</span>
                  <span className="text-right font-bold text-gray-900 dark:text-white">
                    {studio.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!session?.user) {
                    toast.error("Please login before booking.");
                    router.push("/login");
                    return;
                  }

                  if (studio.ownerEmail === session.user.email) {
                    toast.error("You cannot book your own studio.");
                    return;
                  }

                  setBookingOpen(true);
                }}
                className="w-full rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700 sm:py-4 sm:text-base"
              >
                Book This Studio
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
                You will be charged after booking confirmation.
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:mt-6">
                <ShieldCheck
                  size={16}
                  className="shrink-0 text-green-600 dark:text-green-400"
                />
                Secure Booking Experience
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Booking Modal */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 px-3 py-4 sm:px-4 sm:py-6"
          onClick={() => {
            if (!bookingLoading) setBookingOpen(false);
          }}
        >
          <div
            className="my-auto max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-900 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                  Book Your Studio
                </h2>

                <p className="mt-1 break-words text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                  {studio.title}
                </p>
              </div>

              <button
                onClick={() => setBookingOpen(false)}
                disabled={bookingLoading}
                className="shrink-0 rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Close booking modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-4 sm:space-y-5">
              {/* Booking Date */}
              <div>
                <label
                  htmlFor="bookingDate"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Booking Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="bookingDate"
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className={`${inputStyles} pl-11`}
                    required
                  />
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="startTime"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Start Time
                </label>

                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={inputStyles}
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="hours"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Booking Duration
                </label>

                <select
                  id="hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className={inputStyles}
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="5">5 Hours</option>
                  <option value="6">6 Hours</option>
                  <option value="8">8 Hours</option>
                </select>
              </div>

              {/* Guests */}
              <div>
                <label
                  htmlFor="guests"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Number of Guests
                </label>

                <input
                  id="guests"
                  type="number"
                  min="1"
                  max={studio.maxCapacity}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className={inputStyles}
                  required
                />

                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Maximum capacity: {studio.maxCapacity} guests
                </p>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Additional Notes (Optional)
                </label>

                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Tell the host about your requirements..."
                  className={inputStyles}
                />
              </div>

              {/* Time Summary */}
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <div className="flex justify-between gap-3">
                  <span>Start Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {startTime || "--:--"}
                  </span>
                </div>

                <div className="mt-2 flex justify-between gap-3">
                  <span>End Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {endTime || "Invalid time"}
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-950/40 sm:p-5">
                <div className="flex justify-between gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    ৳{studio.hourlyRate} × {hours} hours
                  </span>
                  <span>৳{totalPrice}</span>
                </div>

                <div className="mt-3 flex justify-between gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span>Security Deposit</span>
                  <span>৳{studio.securityDeposit}</span>
                </div>

                <div className="mt-3 flex justify-between gap-3 border-t border-violet-200 pt-3 text-sm font-bold text-gray-900 dark:border-violet-800 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-violet-700 dark:text-violet-400">
                    ৳{grandTotal}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Includes refundable security deposit of ৳
                  {studio.securityDeposit}.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={bookingLoading || !endTime}
                className="w-full rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
              >
                {bookingLoading
                  ? "Submitting Booking..."
                  : "Confirm Booking Request"}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400 dark:text-gray-500">
                Your booking will remain Pending until the host confirms it.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-3 top-3 z-[202] rounded-full bg-white/20 p-2.5 text-white transition hover:bg-white/40 sm:right-5 sm:top-5 sm:p-3"
            aria-label="Close image preview"
          >
            <X size={24} />
          </button>

          <div
            className="relative h-[75vh] w-full max-w-6xl sm:h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Studio gallery preview"
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 z-[202] -translate-x-1/2 whitespace-nowrap rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white sm:bottom-5 sm:px-5 sm:text-sm">
            {allImages.indexOf(selectedImage) + 1} / {allImages.length}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}