import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
          <KeyRound size={27} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-gray-900 dark:text-white">
          Password Reset
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Password reset is not enabled for this assignment. If you can access your account, sign in with your existing credentials.
        </p>
        <Link
          href="/login"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <ArrowLeft size={17} /> Back to Login
        </Link>
      </section>
    </main>
  );
}
