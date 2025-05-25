/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/account/bookmarks:
 *   get:
 *     summary: Lấy danh sách truyện đã bookmark
 *     description: Lấy tất cả truyện mà người dùng đã lưu vào bookmark
 *     tags:
 *       - Account
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách truyện đã bookmark
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookmarks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy người dùng
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
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    // Lấy danh sách truyện đã lưu
    const [bookmarks] = (await pool.execute(
      `
      SELECT 
        s.story_id,
        s.title,
        s.cover_image,
        mc.name as main_category,
        sb.created_at as bookmarked_at
      FROM story_bookmarks sb
      JOIN stories s ON sb.story_id = s.story_id
      JOIN main_categories mc ON s.main_category_id = mc.category_id
      WHERE sb.user_id = ?
      ORDER BY sb.created_at DESC
    `,
      [user.user_id]
    )) as any[];

    return NextResponse.json({
      bookmarks: bookmarks.map((bookmark: any) => ({
        ...bookmark,
        bookmarked_at: bookmark.bookmarked_at.toISOString(),
      })),
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy danh sách truyện đã lưu:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
