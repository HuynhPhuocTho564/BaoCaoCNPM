/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/ai/chat-history:
 *   get:
 *     summary: Lấy lịch sử chat AI
 *     description: Lấy danh sách tất cả phiên chat AI của người dùng
 *     tags:
 *       - AI
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lịch sử chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       chat_id:
 *                         type: integer
 *                         description: ID phiên chat
 *                       title:
 *                         type: string
 *                         description: Tiêu đề phiên chat
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Thời gian cập nhật cuối
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

    const [users] = (await pool.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [session.user.email]
    )) as any[];

    const [history] = (await pool.execute(
      `
      SELECT chat_id, title, updated_at
      FROM ai_chat_history
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `,
      [users[0].user_id]
    )) as any[];

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử chat:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
