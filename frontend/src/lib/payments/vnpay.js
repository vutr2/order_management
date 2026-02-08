import crypto from 'crypto';

const VNP_TMN_CODE = () => process.env.VNPAY_TMN_CODE;
const VNP_HASH_SECRET = () => process.env.VNPAY_HASH_SECRET;
const VNP_URL = () =>
  process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNP_RETURN_URL = () =>
  process.env.VNP_RETURN_URL || 'http://localhost:3000/billing/payment-result';

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export function createPaymentUrl({ orderId, amount, orderInfo, ipAddr }) {
  const tmnCode = VNP_TMN_CODE();
  const secretKey = VNP_HASH_SECRET();

  // Enhanced validation
  if (!tmnCode || typeof tmnCode !== 'string') {
    throw new Error(
      'VNP_TMN_CODE environment variable is not configured or invalid'
    );
  }

  if (!secretKey || typeof secretKey !== 'string') {
    throw new Error(
      'VNP_HASH_SECRET environment variable is not configured or invalid'
    );
  }

  const date = new Date();
  const createDate =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');

  const params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: VNP_RETURN_URL(),
    vnp_IpAddr: ipAddr || '127.0.0.1',
    vnp_CreateDate: createDate,
  };

  const sortedParams = sortObject(params);
  const signData = new URLSearchParams(sortedParams).toString();

  // Ensure secretKey is treated as a string buffer
  const hmac = crypto.createHmac('sha512', String(secretKey));
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  sortedParams.vnp_SecureHash = signed;
  const paymentUrl = `${VNP_URL()}?${new URLSearchParams(sortedParams).toString()}`;

  return paymentUrl;
}

export function verifyReturnUrl(query) {
  const secretKey = VNP_HASH_SECRET();

  if (!secretKey || typeof secretKey !== 'string') {
    console.error('VNP_HASH_SECRET is not configured properly');
    return false;
  }

  const vnpParams = {};
  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('vnp_')) {
      vnpParams[key] = value;
    }
  }

  const secureHash = vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;

  const sortedParams = sortObject(vnpParams);
  const signData = new URLSearchParams(sortedParams).toString();

  // Ensure secretKey is treated as a string buffer
  const hmac = crypto.createHmac('sha512', String(secretKey));
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === signed;
}
