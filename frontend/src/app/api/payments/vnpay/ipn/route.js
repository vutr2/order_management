import { verifyReturnUrl } from '@/lib/payments/vnpay';
import { updatePaymentStatus, getPaymentByTxnRef } from '@/lib/db/queries/payments';
import { updateSubscription } from '@/lib/db/queries/subscription';

export async function GET(req) {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  const txnRef = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;
  const transactionNo = query.vnp_TransactionNo || '';
  const bankCode = query.vnp_BankCode || '';
  const amount = Number(query.vnp_Amount) / 100;

  if (!txnRef) {
    return Response.json({ RspCode: '99', Message: 'Missing txnRef' });
  }

  const payment = await getPaymentByTxnRef(txnRef);
  if (!payment) {
    return Response.json({ RspCode: '01', Message: 'Order not found' });
  }

  if (payment.status === 'success') {
    return Response.json({ RspCode: '02', Message: 'Order already confirmed' });
  }

  if (payment.amount !== amount) {
    return Response.json({ RspCode: '04', Message: 'Invalid amount' });
  }

  const isValid = verifyReturnUrl(query);
  if (!isValid) {
    return Response.json({ RspCode: '97', Message: 'Invalid checksum' });
  }

  if (responseCode === '00') {
    await updatePaymentStatus(txnRef, {
      status: 'success',
      vnpayTransactionNo: transactionNo,
      vnpayResponseCode: responseCode,
      bankCode,
      paidAt: new Date(),
    });

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await updateSubscription(payment.userId, {
      plan: payment.plan,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      vnpayTransactionId: transactionNo,
    });
  } else {
    await updatePaymentStatus(txnRef, {
      status: 'failed',
      vnpayTransactionNo: transactionNo,
      vnpayResponseCode: responseCode,
      bankCode,
    });
  }

  return Response.json({ RspCode: '00', Message: 'Confirm Success' });
}
