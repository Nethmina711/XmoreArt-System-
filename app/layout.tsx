import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { SettingsProvider } from "@/lib/context/SettingsContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";

export const metadata: Metadata = {
  title: "XMORE ART SOLUTIONS | Creative & Production Agency | Monaragala, Sri Lanka",
  description: "XMORE ART SOLUTIONS is an integrated creative agency in Monaragala, Sri Lanka providing precision printing, brand identity design, 4K videography, photography, and digital marketing under one roof.",
  keywords: [
    "XMORE ART SOLUTIONS",
    "Printing Monaragala",
    "Graphic Design Sri Lanka",
    "Digital Marketing Uva Province",
    "Wedding Photography Monaragala",
    "Videography Sri Lanka",
    "Branding Agency Monaragala",
    "Signboard and Banner Printing"
  ],
  authors: [{ name: "XMORE ART SOLUTIONS" }],
  openGraph: {
    title: "XMORE ART SOLUTIONS | Creative Solutions Under One Roof",
    description: "Printing, Digital Marketing, Graphic Design, Photography, Videography & Branding in Monaragala, Sri Lanka.",
    url: "https://xmoreart.lk",
    siteName: "XMORE ART SOLUTIONS",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "XMORE ART SOLUTIONS Creative Agency",
      },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "XMORE ART SOLUTIONS | Creative & Production Agency",
    description: "Creative solutions under one roof. Monaragala, Sri Lanka.",
    images: ["https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-brand-dark-gray selection:bg-brand-red selection:text-white">
        <AuthProvider>
          <SettingsProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
