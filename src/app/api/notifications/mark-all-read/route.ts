import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Đánh dấu tất cả thông báo đã đọc
 *     description: Đánh dấu tất cả thông báo của người dùng hiện tại là đã đọc
 *     tags:
 *       - Notifications
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Đánh dấu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã đánh dấu tất cả là đã đọc"
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
export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    await pool.execute(
      "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
      [session.user.id]
    );

    return NextResponse.json({ message: "Đã đánh dấu tất cả là đã đọc" });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
