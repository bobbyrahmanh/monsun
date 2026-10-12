import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TasksProvider } from "@/hooks/TasksContext";
import Logo from "@/components/Logo";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyLifeOS",
  description: "A simple personal productivity dashboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TasksProvider>
          <div className="mx-auto flex min-h-screen max-w-full gap-6 lg:p-6">
            <Sidebar />
            <div className="min-w-0 flex-1 px-4 pb-28 pt-5 lg:px-0 lg:pb-0 lg:pt-0">
              <div className="mb-6 lg:hidden">
                <Logo />
              </div>
              <main>{children}</main>
            </div>
          </div>
          <MobileNav />
        </TasksProvider>
      </body>
    </html>
  );
}
