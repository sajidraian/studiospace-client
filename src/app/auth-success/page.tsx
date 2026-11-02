"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const createAuthCookie = async () => {
      try {
        const response = await fetch("/api/auth-cookie", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Authentication failed."
          );
        }

        toast.success("Login successful!");
        router.replace("/");
        router.refresh();
      } catch (error) {
        console.error("Auth cookie error:", error);

        setError(true);
        toast.error("Login successful, but authentication setup failed.");
      }
    };

    createAuthCookie();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            Authentication Failed
          </h2>

          <p className="mt-2 text-gray-500">
            Please login again.
          </p>

          <button
            onClick={() => router.replace("/login")}
            className="mt-5 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2
          size={40}
          className="mx-auto animate-spin text-violet-600"
        />

        <p className="mt-4 font-semibold text-gray-700">
          Completing your login...
        </p>
      </div>
    </div>
  );
}