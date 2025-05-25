/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     description: Tạo tài khoản người dùng mới trong hệ thống
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             username: "nguoidung123"
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *       400:
 *         description: Email đã được sử dụng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Email đã được sử dụng"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Đã xảy ra lỗi khi đăng ký"
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await AuthService.register(data);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === "Email đã được sử dụng") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký" },
      { status: 500 }
    );
  }
}
