import { verifyReturnUrl } from "@/lib/payments/vnpay";
import { updatePaymentStatus, getPaymentByTxnRef } from "@/lib/db/queries/payments";
import { updateSubscription } from "@/lib/db/queries/subscription";
import { redirect } from "next/navigation";

export async function GET(req) {
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  const isValid = verifyReturnUrl(query);
  const txnRef = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;
  const transactionNo = query.vnp_TransactionNo || "";
  const bankCode = query.vnp_BankCode || "";

  if (!txnRef) {
    redirect("/billing?status=error");
  }

  const payment = await getPaymentByTxnRef(txnRef);
  if (!payment) {
    redirect("/billing?status=error");
  }

  if (isValid && responseCode === "00") {
    await updatePaymentStatus(txnRef, {
      status: "success",
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
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      vnpayTransactionId: transactionNo,
    });

    redirect("/billing?status=success");
  } else {
    await updatePaymentStatus(txnRef, {
      status: "failed",
      vnpayTransactionNo: transactionNo,
      vnpayResponseCode: responseCode,
      bankCode,
    });

    redirect("/billing?status=failed");
  }
}
