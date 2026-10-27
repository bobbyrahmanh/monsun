import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SettingsProvider } from "@/hooks/SettingsContext";
import { TasksProvider } from "@/hooks/TasksContext";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/hooks/ThemeContext";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyLifeOS",
  description: "A simple personal productivity dashboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
        <SettingsProvider>
        <TasksProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="min-w-0 flex-1 p-3 pb-28 sm:p-5 lg:p-6">
              {/* Panel kaca besar yang membungkus isi halaman */}
              <main className="mx-auto max-w-[1200px] rounded-[2rem] border border-edge/60 bg-surface/35 p-4 shadow-glass backdrop-blur-md sm:p-6 lg:min-h-[calc(100vh-3rem)] lg:p-8">
                <div className="mb-6 lg:hidden">
                  <Logo />
                </div>
                {children}
              </main>
            </div>
          </div>
          <MobileNav />
        </TasksProvider>
        </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
