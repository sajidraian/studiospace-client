import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),

  title: {
    default: "StudioSpace | Creative Spaces for Creators",
    template: "%s | StudioSpace",
  },

  description:
    "Discover, explore, and book inspiring photography studios, music spaces, podcast rooms, and creative production studios with StudioSpace.",

  keywords: [
    "StudioSpace",
    "Creative Studio Rental",
    "Photography Studio",
    "Podcast Studio",
    "Music Studio",
    "Production Studio",
    "Studio Booking",
  ],

  applicationName: "StudioSpace",

  openGraph: {
    title: "StudioSpace | Creative Spaces for Creators",
    description:
      "Find and book the perfect creative workspace for your next project.",
    siteName: "StudioSpace",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "StudioSpace | Creative Spaces for Creators",
    description:
      "Discover and book inspiring creative studios with StudioSpace.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} antialiased`}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem("studiospace-theme");
                  var isDark = theme === "dark";

                  document.documentElement.classList.toggle("dark", isDark);
                } catch (error) {}
              })();
            `,
          }}
        />

        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
