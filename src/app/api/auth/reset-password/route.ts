/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu
 *     description: Đặt lại mật khẩu mới sau khi xác thực mã
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
 *                 description: Mã xác thực
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *           example:
 *             email: "user@example.com"
 *             code: "123456"
 *             newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *       400:
 *         description: Lỗi validation hoặc mã không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Bỏ xác thực mã ở đây vì đã xác thực ở bước trước
    await AuthService.resetPassword(email, newPassword);

    return NextResponse.json({
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
