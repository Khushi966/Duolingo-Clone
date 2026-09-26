import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "Duolingo Clone - Learn Spanish for Free",
  description: "Learn Spanish with bite-sized, gamified lessons featuring streaks, leagues, crowns, and original mascot Pip!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-[#131F24] text-[#3C3C3C] dark:text-[#E5E5E5] min-h-screen">
        <div className="flex min-h-screen">
          {/* Desktop Left Sidebar */}
          <Sidebar />

          {/* Main Application Viewport */}
          <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
