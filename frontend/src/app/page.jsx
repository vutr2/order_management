import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OM</span>
          </div>
          <span className="font-semibold text-lg">OrderHub</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
            Shopee &middot; Lazada &middot; More
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Manage All Your Orders
            <br />
            <span className="text-blue-600">In One Place</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Connect Shopee, Lazada and more. Track orders and manage inventory
            — all from a single dashboard.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Start Free
            </Link>
            <Link
              href="/sign-in"
              className="border border-zinc-300 dark:border-zinc-700 px-6 py-3 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              title="Multi-Platform Orders"
              description="Sync orders from Shopee, Lazada and other e-commerce platforms automatically."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" />
                </svg>
              }
            />
            <FeatureCard
              title="Inventory Tracking"
              description="Real-time stock levels across all platforms with low-stock alerts."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Stats */}
        <section className="px-6 py-16 border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">2+</div>
              <div className="text-sm text-zinc-500 mt-1">Platforms</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">Real-time</div>
              <div className="text-sm text-zinc-500 mt-1">Order Sync</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} OrderHub. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-800 transition">
      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
