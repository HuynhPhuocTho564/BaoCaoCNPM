/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { MailService } from "@/services/mail.service";

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     description: Gửi mã xác thực đến email để đặt lại mật khẩu
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
 *                 description: Email cần đặt lại mật khẩu
 *             required:
 *               - email
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       200:
 *         description: Mã xác thực đã được gửi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *       400:
 *         description: Lỗi validation hoặc email không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Vui lòng nhập email" },
        { status: 400 }
      );
    }

    const resetCode = await AuthService.generateResetCode(email);
    await MailService.sendResetCode(email, resetCode);

    return NextResponse.json({
      message: "Mã xác thực đã được gửi đến email của bạn",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
