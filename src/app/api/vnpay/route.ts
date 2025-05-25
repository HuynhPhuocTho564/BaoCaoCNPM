import { dateFormat, ProductCode, VNPay, VnpLocale } from "vnpay";

const vnpayInstance = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE!,
  secureSecret: process.env.VNP_HASH_SECRET!,
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true, // Sử dụng môi trường sandbox
});

/**
 * @swagger
 * /api/vnpay:
 *   post:
 *     summary: Tạo thanh toán VNPay
 *     description: Tạo URL thanh toán VNPay cho gói premium
 *     tags:
 *       - Payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Số tiền thanh toán (VND)
 *               orderInfo:
 *                 type: string
 *                 description: Thông tin đơn hàng
 *             required:
 *               - amount
 *               - orderInfo
 *           example:
 *             amount: 50000
 *             orderInfo: "Thanh toán gói Premium"
 *     responses:
 *       200:
 *         description: Tạo URL thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL thanh toán VNPay
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const { amount, orderInfo } = await request.json();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tạo mã giao dịch ngẫu nhiên: yyyyMMddHHmmss + 6 số ngẫu nhiên
    const date = new Date();
    const txnRef =
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2) +
      Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0");

    const paymentUrl = await vnpayInstance.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: "13.160.92.202",
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.NEXT_PUBLIC_URL + "/payment/callback",
      vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
      vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
      vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
    });

    return Response.json({ url: paymentUrl });
  } catch (error) {
    console.error("Payment error:", error);
    return Response.json(
      { error: "Không thể tạo URL thanh toán" },
      { status: 500 }
    );
  }
}
