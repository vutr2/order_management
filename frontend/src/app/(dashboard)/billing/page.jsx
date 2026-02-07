import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/db/queries/subscription";
import { getPaymentHistory } from "@/lib/db/queries/payments";
import { PlanCard } from "@/components/billing/plan-card";

const plans = [
  {
    key: "free",
    name: "Free",
    price: 0,
    features: [
      "Up to 50 orders/month",
      "1 platform integration",
      "Basic analytics",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: 199000,
    features: [
      "Unlimited orders",
      "All platform integrations",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    key: "business",
    name: "Business",
    price: 499000,
    features: [
      "Everything in Pro",
      "Multi-user access",
      "Custom reports",
      "API access",
      "Dedicated support",
    ],
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

export default async function BillingPage({ searchParams }) {
  const { userId } = await auth();
  const params = await searchParams;
  const status = params?.status;

  const [subscription, paymentData] = userId
    ? await Promise.all([
        getSubscription(userId),
        getPaymentHistory(userId),
      ])
    : [{ plan: "free", status: "active" }, { payments: [] }];

  const sub = JSON.parse(JSON.stringify(subscription));
  const payments = JSON.parse(JSON.stringify(paymentData.payments));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      {/* Payment status banner */}
      {status === "success" && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="text-sm text-green-800 dark:text-green-200">
            Payment successful! Your plan has been upgraded.
          </span>
        </div>
      )}
      {status === "failed" && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          <span className="text-sm text-red-800 dark:text-red-200">
            Payment failed. Please try again.
          </span>
        </div>
      )}

      {/* Current subscription info */}
      <div className="mb-8 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-black">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Current Subscription</h2>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold capitalize">{sub.plan}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            sub.status === "active"
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}>
            {sub.status}
          </span>
        </div>
        {sub.currentPeriodEnd && (
          <p className="text-sm text-zinc-500 mt-1">
            Renews on {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.key}
            planKey={plan.key}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            isCurrent={sub.plan === plan.key}
          />
        ))}
      </div>

      {/* Payment History */}
      {payments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-black">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="text-left px-5 py-3 font-medium text-zinc-500">Date</th>
                  <th className="text-left px-5 py-3 font-medium text-zinc-500">Plan</th>
                  <th className="text-right px-5 py-3 font-medium text-zinc-500">Amount</th>
                  <th className="text-right px-5 py-3 font-medium text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0">
                    <td className="px-5 py-3">
                      {new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 capitalize">{p.plan}</td>
                    <td className="px-5 py-3 text-right font-medium">{formatCurrency(p.amount)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        p.status === "success"
                          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : p.status === "failed"
                          ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                          : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
