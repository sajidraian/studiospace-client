"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  MapPin,
  Clock,
  Users,
  Pencil,
  Trash2,
  Loader2,
  Building2,
  X,
  AlertTriangle,
} from "lucide-react";
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
}

export default function MyListingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    fetchMyStudios();
  }, [session, isPending]);

  // Fetch My Studios
  const fetchMyStudios = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/my-studios",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      console.log("API Status:", response.status);
      console.log("API Response:", result);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Authentication failed. Please login again.");
          return;
        }

        throw new Error(
          result.message || "Failed to fetch your studio listings."
        );
      }

      setStudios(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch My Studios Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading studios."
      );
    } finally {
      setLoading(false);
    }
  };

  // Open Delete Modal
  const handleDelete = (studio: Studio) => {
    setSelectedStudio(studio);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!selectedStudio) return;

    const id = selectedStudio._id;

    try {
      setDeletingId(id);

      const response = await fetch(
        `http://localhost:5000/api/studios/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete studio");
      }

      setStudios((previous) =>
        previous.filter((studio) => studio._id !== id)
      );

      toast.success("Studio deleted successfully!");

      setShowDeleteModal(false);
      setSelectedStudio(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Close Modal
  const closeDeleteModal = () => {
    if (deletingId) return;

    setShowDeleteModal(false);
    setSelectedStudio(null);
  };

  // Loading State
  if (isPending || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-slate-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-slate-50 px-3 py-6 transition-colors duration-300 dark:bg-gray-950 sm:px-5 sm:py-8 lg:px-7 lg:py-10">
      <div className="mx-auto w-full max-w-7xl min-w-0">

        {/* Header */}
        <div className="mb-7 flex min-w-0 flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 sm:text-sm">
              Host Dashboard
            </p>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              My Studio Listings
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400 sm:text-base">
              Manage and organize your published creative spaces.
            </p>
          </div>

          <Link
            href="/dashboard/add-studio"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 sm:w-auto sm:self-center sm:text-base"
          >
            <Plus size={20} />
            Add New Studio
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900 sm:mb-8 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-3 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <Building2 size={23} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-gray-400 sm:text-sm">
                Total Published Studios
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                {studios.length}
              </h2>
            </div>
          </div>
        </div>

        {/* Studio Listings */}
        {studios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center transition-colors dark:border-gray-700 dark:bg-gray-900 sm:px-6 sm:py-20">
            <Building2 className="mx-auto mb-5 h-12 w-12 text-slate-300 dark:text-gray-600 sm:h-14 sm:w-14" />

            <h2 className="text-lg font-bold text-slate-800 dark:text-white sm:text-xl">
              No Studios Published Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-gray-400">
              Start sharing your creative workspace with the community.
            </p>

            <Link
              href="/dashboard/add-studio"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 sm:w-auto sm:text-base"
            >
              <Plus size={18} />
              Publish Your First Studio
            </Link>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100 dark:bg-gray-800">
                  {studio.image ? (
                    <img
                      src={studio.image}
                      alt={studio.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image Available
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/50 dark:text-green-300 sm:left-4 sm:top-4 sm:text-xs">
                    Published
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 p-4 sm:p-5">
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400 sm:text-sm">
                    {studio.category}
                  </p>

                  <h2 className="mt-2 break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                    {studio.title}
                  </h2>

                  {/* Studio Information */}
                  <div className="mt-4 space-y-3 text-sm text-slate-500 dark:text-gray-400">
                    <p className="flex min-w-0 items-start gap-2">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-violet-500"
                      />
                      <span className="min-w-0 break-words">
                        {studio.location}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock
                        size={17}
                        className="shrink-0 text-violet-500"
                      />
                      <span>
                        ৳{studio.hourlyRate.toLocaleString("en-BD")} / hour
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Users
                        size={17}
                        className="shrink-0 text-violet-500"
                      />
                      <span>
                        Maximum {studio.maxCapacity} people
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 dark:border-gray-800 sm:gap-3 sm:pt-5">
                    <Link
                      href={`/dashboard/edit-studio/${studio._id}`}
                      className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-violet-200 px-2 py-2.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/50 sm:gap-2 sm:text-sm"
                    >
                      <Pencil size={15} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(studio)}
                      disabled={deletingId === studio._id}
                      className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-2 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 sm:gap-2 sm:text-sm"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accessible Delete Confirmation Modal */}
      {showDeleteModal && selectedStudio && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-3 py-5 backdrop-blur-sm sm:px-4"
          onClick={closeDeleteModal}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
            className="relative my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl transition-colors dark:border dark:border-gray-700 dark:bg-gray-900 sm:rounded-3xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeDeleteModal}
              disabled={deletingId !== null}
              className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white sm:right-4 sm:top-4"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Warning Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/50 sm:h-16 sm:w-16">
              <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400 sm:h-8 sm:w-8" />
            </div>

            {/* Modal Content */}
            <div className="mt-5 text-center">
              <h2
                id="delete-modal-title"
                className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl"
              >
                Delete Studio?
              </h2>

              <p
                id="delete-modal-description"
                className="mt-3 break-words text-sm leading-6 text-slate-500 dark:text-gray-400"
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800 dark:text-gray-200">
                  {selectedStudio.title}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row">
              <button
                onClick={closeDeleteModal}
                disabled={deletingId !== null}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}