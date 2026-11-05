"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName?: string;
}

export default function EditStudioPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: session, isPending } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    image: "",
    amenities: "",
    overview: "",
  });

  // Fetch Existing Studio
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    const fetchStudio = async () => {
      try {
        const response = await fetch(`/api/studios/${id}`, {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load studio");
        }

        const studio: Studio = result.data;

        // Only owner can edit
        if (
          studio._id &&
          session.user.email !== studioOwnerEmail(studio)
        ) {
          toast.error("You are not authorized to edit this studio.");
          router.replace("/dashboard/my-listings");
          return;
        }

        setFormData({
          title: studio.title || "",
          category: studio.category || "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          location: studio.location || "",
          image: studio.image || "",
          amenities: Array.isArray(studio.amenities)
            ? studio.amenities.join(", ")
            : "",
          overview: studio.overview || "",
        });
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error ? error.message : "Could not load studio."
        );

        router.replace("/dashboard/my-listings");
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [id, session, isPending, router]);

  // Update form field
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Submit Updated Studio
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hourlyRate = Number(formData.hourlyRate);
    const securityDeposit = Number(formData.securityDeposit || 0);
    const maxCapacity = Number(formData.maxCapacity || 1);

    if (
      !Number.isFinite(hourlyRate) ||
      hourlyRate <= 0 ||
      !Number.isFinite(securityDeposit) ||
      securityDeposit < 0 ||
      !Number.isInteger(maxCapacity) ||
      maxCapacity < 1
    ) {
      toast.error("Please enter valid pricing and capacity.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/studios/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          hourlyRate,
          securityDeposit,
          maxCapacity,
          location: formData.location.trim(),
          image: formData.image.trim(),
          amenities: formData.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          overview: formData.overview.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio");
      }

      toast.success("Studio updated successfully!");

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update studio."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading State
  if (isPending || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600 sm:h-9 sm:w-9" />
      </div>
    );
  }

  if (!session) return null;

  const inputClass =
    "mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-violet-400 dark:focus:ring-violet-900/40 sm:px-4 sm:text-base";

  const labelClass =
    "block text-sm font-semibold text-slate-700 dark:text-gray-200 sm:text-base";

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-slate-50 px-3 py-6 transition-colors duration-300 dark:bg-gray-950 sm:px-5 sm:py-8 lg:px-7 lg:py-10">
      <div className="mx-auto w-full max-w-3xl min-w-0">
        {/* Header */}
        <Link
          href="/dashboard/my-listings"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 sm:mb-7 sm:text-sm"
        >
          <ArrowLeft size={17} />
          Back to My Listings
        </Link>

        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 sm:text-sm">
            Host Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Edit Your Studio
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400 sm:text-base">
            Update your creative space information.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="min-w-0 space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900 sm:space-y-6 sm:p-6 md:p-8"
        >
          {/* Studio Title */}
          <div className="min-w-0">
            <label htmlFor="title" className={labelClass}>
              Studio Title *
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Enter studio title"
            />
          </div>

          {/* Category */}
          <div className="min-w-0">
            <label htmlFor="category" className={labelClass}>
              Studio Category *
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select Category</option>
              <option value="Photography Studio">
                Photography Studio
              </option>
              <option value="Video Production Studio">
                Video Production Studio
              </option>
              <option value="Music Recording Studio">
                Music Recording Studio
              </option>
              <option value="Podcast Studio">Podcast Studio</option>
              <option value="Event Space">Event Space</option>
              <option value="Creative Workspace">
                Creative Workspace
              </option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor="hourlyRate" className={labelClass}>
                Hourly Rate (৳) *
              </label>

              <input
                id="hourlyRate"
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                min="1"
                className={inputClass}
                placeholder="Hourly rate"
              />
            </div>

            <div className="min-w-0">
              <label htmlFor="securityDeposit" className={labelClass}>
                Security Deposit (৳)
              </label>

              <input
                id="securityDeposit"
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                min="0"
                className={inputClass}
                placeholder="Security deposit"
              />
            </div>
          </div>

          {/* Capacity */}
          <div className="min-w-0">
            <label htmlFor="maxCapacity" className={labelClass}>
              Maximum Capacity *
            </label>

            <input
              id="maxCapacity"
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              required
              min="1"
              step="1"
              className={inputClass}
              placeholder="Maximum people"
            />
          </div>

          {/* Location */}
          <div className="min-w-0">
            <label htmlFor="location" className={labelClass}>
              Studio Location *
            </label>

            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Enter location"
            />
          </div>

          {/* Image */}
          <div className="min-w-0">
            <label htmlFor="image" className={labelClass}>
              Studio Image URL *
            </label>

            <input
              id="image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />

            {formData.image && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700">
                <img
                  src={formData.image}
                  alt="Studio preview"
                  className="h-44 w-full object-cover sm:h-56 md:h-64"
                />
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="min-w-0">
            <label htmlFor="amenities" className={labelClass}>
              Amenities
            </label>

            <input
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              className={inputClass}
              placeholder="Air Conditioning, Professional Lighting"
            />

            <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-gray-500">
              Separate each amenity with a comma.
            </p>
          </div>

          {/* Overview */}
          <div className="min-w-0">
            <label htmlFor="overview" className={labelClass}>
              Studio Description *
            </label>

            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              required
              rows={5}
              className={`${inputClass} resize-y`}
              placeholder="Describe your studio..."
            />
          </div>

          {/* Submit */}
          <div className="border-t border-slate-100 pt-5 dark:border-gray-800 sm:pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
            >
              {saving ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Updating Studio...
                </>
              ) : (
                <>
                  <Save size={19} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// Helper function
function studioOwnerEmail(studio: Studio): string {
  return studio.ownerEmail;
}