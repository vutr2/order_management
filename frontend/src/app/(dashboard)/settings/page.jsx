import { Suspense } from "react";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Suspense
        fallback={
          <div className="h-96 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
        }
      >
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "w-full shadow-none border border-zinc-200 dark:border-zinc-800 rounded-xl",
            },
          }}
        />
      </Suspense>
    </div>
  );
}
