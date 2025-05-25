/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/library/new:
 *   get:
 *     summary: Lấy danh sách truyện mới
 *     description: Trả về danh sách truyện được cập nhật gần đây nhất
 *     tags:
 *       - Library
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang (mỗi trang 20 truyện)
 *     responses:
 *       200:
 *         description: Danh sách truyện mới
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;
    const offset = (page - 1) * limit;

    const [stories] = (await pool.query(
      `
      SELECT 
        s.story_id,
        s.title,
        s.description,
        s.cover_image,
        s.view_count,
        s.updated_at,
        mc.name as main_category
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      WHERE s.status = 'published'
      ORDER BY s.updated_at DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset]
    )) as any[];

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện mới:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
