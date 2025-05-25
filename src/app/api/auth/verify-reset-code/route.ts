/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

/**
 * @swagger
 * /api/auth/verify-reset-code:
 *   post:
 *     summary: Xác thực mã đặt lại mật khẩu
 *     description: Xác thực mã được gửi qua email để đặt lại mật khẩu
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email người dùng
 *               code:
 *                 type: string
 *                 description: Mã xác thực 6 số
 *             required:
 *               - email
 *               - code
 *           example:
 *             email: "user@example.com"
 *             code: "123456"
 *     responses:
 *       200:
 *         description: Mã xác thực hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *       400:
 *         description: Mã không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    await AuthService.verifyResetCode(email, code);

    return NextResponse.json({
      message: "Mã xác thực hợp lệ",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
