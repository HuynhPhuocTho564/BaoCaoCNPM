/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     description: Xác thực thông tin đăng nhập và trả về token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *       401:
 *         description: Thông tin đăng nhập không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Email hoặc mật khẩu không đúng"
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await AuthService.login(email, password);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
