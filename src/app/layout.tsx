import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";
import { AppwriteProvider } from "@/providers/AppwriteProvider";
import QueryProvider from "@/providers/QueryProvider";
import { AuthGuard } from "@/providers/AuthGuard";
import { Toaster } from 'sonner';
import { MobileNav } from '@/components/layout/MobileNav';
import { Navbar } from '@/components/layout/Navbar';

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "الحصون الخمسة | نظام حفظ القرآن الكريم",
  description: "نظام متكامل لحفظ القرآن الكريم وتطبيق منهج الحصون الخمسة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen pb-16 md:pb-0">
        <QueryProvider>
          <AppwriteProvider>
            <AuthGuard>
              <Navbar />
              {children}
              <MobileNav />
              <Toaster richColors position="top-center" />
            </AuthGuard>
          </AppwriteProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
