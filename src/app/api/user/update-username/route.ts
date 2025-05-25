/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthService } from "@/services/auth.service";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * @swagger
 * /api/user/update-username:
 *   patch:
 *     summary: Cập nhật tên người dùng
 *     description: Thay đổi tên hiển thị của người dùng
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
 *               username:
 *                 type: string
 *                 description: Tên người dùng mới
 *             required:
 *               - username
 *           example:
 *             username: "TenMoi123"
 *     responses:
 *       200:
 *         description: Cập nhật tên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Tên không hợp lệ
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
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Tên không được để trống" },
        { status: 400 }
      );
    }

    const result = await AuthService.updateUsername(
      parseInt(session.user.id as string),
      username
    );

    // Update session data
    session.user.name = username;

    return NextResponse.json({
      ...result,
      user: {
        ...session.user,
        name: username,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
