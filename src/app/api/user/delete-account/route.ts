/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from "@/services/auth.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * @swagger
 * /api/user/delete-account:
 *   delete:
 *     summary: Xóa tài khoản người dùng
 *     description: Xóa vĩnh viễn tài khoản người dùng sau khi xác thực mật khẩu
 *     tags:
 *       - User Management
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Mật khẩu hiện tại để xác thực
 *             required: ["password"]
 *     responses:
 *       200:
 *         description: Xóa tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản đã được xóa thành công"
 *       400:
 *         description: Mật khẩu không đúng hoặc thiếu thông tin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Vui lòng nhập mật khẩu" },
        { status: 400 }
      );
    }

    const result = await AuthService.deleteAccount(
      parseInt(session.user.id),
      password
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
