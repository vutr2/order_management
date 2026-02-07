import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { UserButton } from "@clerk/nextjs";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export default async function DashboardLayout({ children }) {
  const { userId } = await auth();
  if (!userId && process.env.SKIP_AUTH !== "true") {
    redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OM</span>
          </div>
          <span className="font-semibold text-lg">OrderHub</span>
        </div>
        <SidebarNav />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center justify-between px-6">
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OM</span>
            </div>
            <span className="font-semibold">OrderHub</span>
          </div>
          <div className="hidden md:block" />
          <Suspense fallback={<div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />}>
            <UserButton afterSignOutUrl="/" />
          </Suspense>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
