'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    amount
  );

export function PlanCard({ name, price, features, isCurrent, planKey }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleUpgrade() {
    startTransition(async () => {
      const res = await fetch('/api/payments/vnpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        router.push(data.paymentUrl);
      }
    });
  }

  return (
    <div
      className={`border rounded-xl p-6 bg-white dark:bg-black ${
        isCurrent
          ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900'
          : 'border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <div className="mb-4">
        {price === 0 ? (
          <span className="text-3xl font-bold">Free</span>
        ) : (
          <>
            <span className="text-3xl font-bold">{formatCurrency(price)}</span>
            <span className="text-sm text-zinc-500">/month</span>
          </>
        )}
      </div>

      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <svg
              className="w-4 h-4 text-green-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <div className="text-sm font-medium text-blue-600 text-center py-2">
          Current Plan
        </div>
      ) : price === 0 ? null : (
        <button
          onClick={handleUpgrade}
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isPending ? 'Processing...' : 'Upgrade'}
        </button>
      )}
    </div>
  );
}
