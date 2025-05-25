/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     description: Lấy 10 thông báo mới nhất của người dùng hiện tại
 *     tags:
 *       - Notifications
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const [notifications] = (await pool.execute(
      `
      SELECT 
        n.notification_id,
        n.title,
        n.message,
        n.is_read,
        n.created_at,
        n.story_id,
        n.chapter_id
      FROM notifications n
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
      LIMIT 10
    `,
      [session.user.id]
    )) as any[];

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
