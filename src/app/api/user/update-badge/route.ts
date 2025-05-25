/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

/**
 * @swagger
 * /api/user/update-badge:
 *   post:
 *     summary: Cập nhật huy hiệu người dùng
 *     description: Kích hoạt hoặc hủy kích hoạt huy hiệu premium cho người dùng
 *     tags:
 *       - User Management
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật huy hiệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Huy hiệu đã được cập nhật"
 *                 has_badge:
 *                   type: boolean
 *                   description: Trạng thái huy hiệu mới
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
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 401 }
      );
    }

    const result = await AuthService.updateBadgeStatus(
      parseInt(session.user.id)
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật huy hiệu:", error);
    return NextResponse.json(
      { error: error.message || "Đã có lỗi xảy ra khi cập nhật huy hiệu" },
      { status: 500 }
    );
  }
}
