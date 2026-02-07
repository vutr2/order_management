"use client";

import { useTransition } from "react";
import { changeOrderStatus } from "@/lib/actions/orders";

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipping",
  "delivered",
  "cancelled",
];

export function StatusUpdateForm({ orderId, currentStatus }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    startTransition(async () => {
      await changeOrderStatus(orderId, newStatus);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Status:
      </label>
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 bg-white dark:bg-black disabled:opacity-50 transition"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="text-xs text-zinc-500">Updating...</span>
      )}
    </div>
  );
}
