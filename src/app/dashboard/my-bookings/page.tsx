"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  XCircle,
  Loader2,
  ArrowRight,
  ClipboardList,
  Download,
  CheckCircle2,
  Building2,
  UserRound,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

interface Booking {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  guests: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  notes?: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
}

type TabType = "my-bookings" | "studio-requests";

export default function MyBookingsPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("my-bookings");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const [customerResponse, ownerResponse] = await Promise.all([
        fetch("/api/my-bookings", {
          credentials: "include",
          cache: "no-store",
        }),
        fetch("/api/owner-bookings", {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const customerResult = await customerResponse.json();
      const ownerResult = await ownerResponse.json();

      if (!customerResponse.ok) {
        throw new Error(customerResult.message || "Failed to load bookings.");
      }

      if (!ownerResponse.ok) {
        throw new Error(ownerResult.message || "Failed to load requests.");
      }

      setBookings(customerResult.data || []);
      setOwnerBookings(ownerResult.data || []);
    } catch (error) {
      console.error("Fetch Bookings Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [sessionLoading, session?.user?.id]);

  // Confirm Booking
  const handleConfirmBooking = async (bookingId: string) => {
    try {
      setConfirmingId(bookingId);

      const response = await fetch(
        `/api/bookings/${bookingId}/confirm`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not confirm booking.");
      }

      setOwnerBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Confirmed" }
            : booking
        )
      );

      toast.success("Booking confirmed successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to confirm booking."
      );
    } finally {
      setConfirmingId(null);
    }
  };

  // Download Invoice
  const handleDownloadInvoice = async (booking: Booking) => {
    try {
      setDownloadingId(booking._id);

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(109, 40, 217);
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(25);
      doc.setFont("helvetica", "bold");
      doc.text("StudioSpace", 20, 20);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Creative Workspace Booking Platform", 20, 29);

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("BOOKING INVOICE", pageWidth - 20, 20, {
        align: "right",
      });

      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Invoice Date: ${new Date().toLocaleDateString("en-GB")}`,
        20,
        60
      );

      doc.text(`Booking ID: ${booking._id}`, 20, 68);

      doc.line(20, 77, pageWidth - 20, 77);

      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Studio Information", 20, 90);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Studio Name: ${booking.studioTitle}`, 20, 102);
      doc.text(`Location: ${booking.studioLocation}`, 20, 112);

      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Booking Details", 20, 132);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Booking Date: ${booking.bookingDate}`, 20, 144);

      doc.text(
        `Booking Time: ${booking.startTime} - ${booking.endTime}`,
        20,
        154
      );

      doc.text(`Number of Guests: ${booking.guests}`, 20, 164);

      doc.line(20, 177, pageWidth - 20, 177);

      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Summary", 20, 192);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Total Booking Price:", 20, 207);

      doc.setFont("helvetica", "bold");
      doc.text(
        `BDT ${Number(booking.totalPrice).toLocaleString("en-US")}`,
        pageWidth - 20,
        207,
        { align: "right" }
      );

      doc.setFont("helvetica", "normal");
      doc.text("Booking Status:", 20, 222);

      if (booking.status === "Confirmed") {
        doc.setTextColor(22, 163, 74);
      } else if (booking.status === "Cancelled") {
        doc.setTextColor(220, 38, 38);
      } else {
        doc.setTextColor(217, 119, 6);
      }

      doc.text(booking.status, pageWidth - 20, 222, {
        align: "right",
      });

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.line(20, 240, pageWidth - 20, 240);

      doc.text(
        "Thank you for choosing StudioSpace!",
        pageWidth / 2,
        253,
        { align: "center" }
      );

      doc.text(
        "This is a computer-generated booking invoice, not a payment receipt.",
        pageWidth / 2,
        261,
        { align: "center" }
      );

      const safeTitle = booking.studioTitle
        .replace(/[^a-z0-9]/gi, "-")
        .slice(0, 30);

      doc.save(`StudioSpace-Invoice-${safeTitle}-${booking._id}.pdf`);

      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Invoice Download Error:", error);
      toast.error("Could not generate invoice.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancellingId(selectedBooking._id);

      const response = await fetch(
        `/api/bookings/${selectedBooking._id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not cancel booking.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === selectedBooking._id
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      );

      toast.success("Booking cancelled successfully!");
      setSelectedBooking(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";

      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    }
  };

  const cardClass =
    "rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800";

  const headingClass = "font-bold text-gray-900 dark:text-white";
  const mutedClass = "text-gray-500 dark:text-gray-400";
  const detailClass = "text-sm font-semibold text-gray-800 dark:text-gray-200";

  // Loading
  if (sessionLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // Login Required
  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
        <ClipboardList className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />

        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Login Required
        </h2>

        <p className={`mt-2 text-sm ${mutedClass}`}>
          Please login to view your bookings.
        </p>

        <Link
          href="/login"
          className="mt-5 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 transition-colors dark:bg-gray-900 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-5xl">
        {/* Compact Header */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
              Your Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
              Booking Management
            </h1>

            <p className={`mt-1 text-sm ${mutedClass}`}>
              Manage your bookings and studio requests.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 sm:self-center"
          >
            Explore Studios
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Compact Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              title: "My Bookings",
              value: bookings.length,
              icon: ClipboardList,
              color:
                "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300",
            },
            {
              title: "Studio Requests",
              value: ownerBookings.length,
              icon: Building2,
              color:
                "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
            },
            {
              title: "Pending Requests",
              value: ownerBookings.filter((b) => b.status === "Pending").length,
              icon: Clock,
              color:
                "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`${cardClass} flex items-center gap-3 p-4`}
              >
                <div className={`rounded-lg p-2.5 ${item.color}`}>
                  <Icon size={21} />
                </div>

                <div>
                  <p className={`text-xs ${mutedClass}`}>{item.title}</p>
                  <p className={`text-xl ${headingClass}`}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className={`${cardClass} mb-5 flex gap-2 p-2`}>
          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition sm:text-sm ${
              activeTab === "my-bookings"
                ? "bg-violet-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <UserRound size={17} />
            My Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab("studio-requests")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition sm:text-sm ${
              activeTab === "studio-requests"
                ? "bg-violet-600 text-white shadow"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Building2 size={17} />
            Studio Requests ({ownerBookings.length})
          </button>
        </div>

        {/* Customer Bookings */}
        {activeTab === "my-bookings" && (
          <>
            {bookings.length === 0 ? (
              <div className={`${cardClass} px-5 py-12 text-center`}>
                <ClipboardList className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />

                <h2 className={`text-lg ${headingClass}`}>
                  No Bookings Yet
                </h2>

                <p className={`mt-1 text-sm ${mutedClass}`}>
                  You have not booked any creative studio yet.
                </p>

                <Link
                  href="/studios"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Explore Studios <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <article
                    key={booking._id}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
                      <div className="relative h-40 bg-gray-100 dark:bg-gray-700 sm:h-full sm:min-h-[170px]">
                        {booking.studioImage ? (
                          <Image
                            src={booking.studioImage}
                            alt={booking.studioTitle}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className={`truncate text-lg ${headingClass}`}>
                              {booking.studioTitle}
                            </h2>

                            <p
                              className={`mt-1 flex items-center gap-1.5 text-xs ${mutedClass}`}
                            >
                              <MapPin size={14} className="shrink-0" />
                              <span className="truncate">
                                {booking.studioLocation}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${getStatusStyle(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          <div>
                            <p
                              className={`flex items-center gap-1 text-[11px] ${mutedClass}`}
                            >
                              <CalendarDays size={13} /> Date
                            </p>

                            <p className={`mt-1 ${detailClass}`}>
                              {booking.bookingDate}
                            </p>
                          </div>

                          <div>
                            <p
                              className={`flex items-center gap-1 text-[11px] ${mutedClass}`}
                            >
                              <Clock size={13} /> Time
                            </p>

                            <p className={`mt-1 ${detailClass}`}>
                              {booking.startTime} - {booking.endTime}
                            </p>
                          </div>

                          <div>
                            <p
                              className={`flex items-center gap-1 text-[11px] ${mutedClass}`}
                            >
                              <Users size={13} /> Guests
                            </p>

                            <p className={`mt-1 ${detailClass}`}>
                              {booking.guests}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                          <div>
                            <p className={`text-[11px] ${mutedClass}`}>
                              Total Price
                            </p>

                            <p className="text-lg font-extrabold text-violet-700 dark:text-violet-400">
                              ৳
                              {Number(booking.totalPrice).toLocaleString(
                                "en-BD"
                              )}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleDownloadInvoice(booking)}
                              disabled={downloadingId !== null}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                            >
                              {downloadingId === booking._id ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Download size={14} />
                              )}
                              Invoice
                            </button>

                            {booking.status === "Pending" && (
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                              >
                                <XCircle size={14} />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* Owner Studio Requests */}
        {activeTab === "studio-requests" && (
          <>
            {ownerBookings.length === 0 ? (
              <div className={`${cardClass} px-5 py-12 text-center`}>
                <Building2 className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />

                <h2 className={`text-lg ${headingClass}`}>
                  No Studio Requests Yet
                </h2>

                <p className={`mt-1 text-sm ${mutedClass}`}>
                  Booking requests for your studios will appear here.
                </p>

                <Link
                  href="/dashboard/add-studio"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Add New Studio <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {ownerBookings.map((booking) => (
                  <article
                    key={booking._id}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr]">
                      <div className="relative h-40 bg-gray-100 dark:bg-gray-700 sm:h-full sm:min-h-[170px]">
                        {booking.studioImage ? (
                          <Image
                            src={booking.studioImage}
                            alt={booking.studioTitle}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                              Studio Request
                            </p>

                            <h2 className={`mt-1 truncate text-lg ${headingClass}`}>
                              {booking.studioTitle}
                            </h2>

                            <p
                              className={`mt-1 flex items-center gap-1.5 text-xs ${mutedClass}`}
                            >
                              <MapPin size={14} />
                              {booking.studioLocation}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${getStatusStyle(booking.status)}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50">
                          <p className="text-[10px] font-bold uppercase text-gray-400">
                            Customer
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {booking.customerName || "Customer"}
                          </p>

                          <p className={`text-xs ${mutedClass}`}>
                            {booking.customerEmail || "Email not available"}
                          </p>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          <div>
                            <p
                              className={`flex items-center gap-1 text-[11px] ${mutedClass}`}
                            >
                              <CalendarDays size={13} /> Date
                            </p>

                            <p className={`mt-1 ${detailClass}`}>
                              {booking.bookingDate}
                            </p>
                          </div>

                          <div>
                            <p
                              className={`flex items-center gap-1 text-[11px] ${mutedClass}`}
                            >
                              <Clock size={13} /> Time
                            </p>

                            <p className={`mt-1 ${detailClass}`}>
                              {booking.startTime} - {booking.endTime}
                            </p>
                          </div>

                          <div>
                            <p
                              className={`flex items-center gap-1 text-[11px] ${mutedClass}`}
                            >
                              <Users size={13} /> Guests
                            </p>

                            <p className={`mt-1 ${detailClass}`}>
                              {booking.guests}
                            </p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-3 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-700">
                            <p className="text-[10px] font-bold uppercase text-gray-400">
                              Customer Notes
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-300">
                              {booking.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                          <div>
                            <p className={`text-[11px] ${mutedClass}`}>
                              Total Price
                            </p>

                            <p className="text-lg font-extrabold text-violet-700 dark:text-violet-400">
                              ৳
                              {Number(booking.totalPrice).toLocaleString(
                                "en-BD"
                              )}
                            </p>
                          </div>

                          {booking.status === "Pending" ? (
                            <button
                              onClick={() =>
                                handleConfirmBooking(booking._id)
                              }
                              disabled={confirmingId !== null}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                            >
                              {confirmingId === booking._id ? (
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <CheckCircle2 size={15} />
                              )}
                              Confirm Booking
                            </button>
                          ) : booking.status === "Confirmed" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              <Check size={15} /> Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                              <XCircle size={15} /> Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Accessible Cancel Confirmation Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            aria-describedby="cancel-modal-description"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>

            <h3
              id="cancel-modal-title"
              className="text-center text-lg font-bold text-gray-900 dark:text-white"
            >
              Cancel Booking?
            </h3>

            <p
              id="cancel-modal-description"
              className="mt-2 text-center text-sm leading-5 text-gray-500 dark:text-gray-300"
            >
              Are you sure you want to cancel your booking for{" "}
              <strong className="text-gray-800 dark:text-white">
                {selectedBooking.studioTitle}
              </strong>
              ?
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={cancellingId !== null}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Keep Booking
              </button>

              <button
                onClick={handleCancelBooking}
                disabled={cancellingId !== null}
                className="flex-1 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {cancellingId ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}