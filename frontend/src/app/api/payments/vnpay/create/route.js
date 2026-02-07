import { auth } from '@clerk/nextjs/server';
import { createPaymentUrl } from '@/lib/payments/vnpay';
import { createPayment } from '@/lib/db/queries/payments';

const PLAN_PRICES = {
  pro: 199000,
  business: 499000,
};

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { plan } = await req.json();
  if (!PLAN_PRICES[plan]) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const amount = PLAN_PRICES[plan];
  const txnRef = `${userId.slice(-8)}_${Date.now()}`;

  await createPayment(userId, {
    amount,
    plan,
    vnpayTxnRef: txnRef,
    status: 'pending',
  });

  const ipAddr =
    req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  const paymentUrl = createPaymentUrl({
    orderId: txnRef,
    amount,
    orderInfo: `OrderHub ${plan} subscription`,
    ipAddr,
  });

  return Response.json({ paymentUrl });
}
