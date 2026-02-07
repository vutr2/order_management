export function PlatformCard({ name, description, isConnected }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-black">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isConnected
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {isConnected ? "Connected" : "Not Connected"}
        </span>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {description}
      </p>
      <button
        disabled
        className="text-sm px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 cursor-not-allowed"
      >
        {isConnected ? "Manage" : "Connect"} (Coming Soon)
      </button>
    </div>
  );
}
