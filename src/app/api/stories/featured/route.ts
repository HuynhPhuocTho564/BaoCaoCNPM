/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/stories/featured:
 *   get:
 *     summary: Lấy danh sách truyện nổi bật
 *     description: Trả về danh sách 6 truyện ngẫu nhiên có ảnh bìa để hiển thị trong slider
 *     tags:
 *       - Stories
 *     responses:
 *       200:
 *         description: Danh sách truyện nổi bật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       story_id:
 *                         type: integer
 *                         description: ID truyện
 *                       title:
 *                         type: string
 *                         description: Tiêu đề truyện
 *                       cover_image:
 *                         type: string
 *                         description: URL ảnh bìa
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    const [stories] = (await pool.execute(`
      SELECT 
        story_id,
        title,
        cover_image
      FROM stories
      WHERE status = 'published' AND cover_image IS NOT NULL
      ORDER BY RAND()
      LIMIT 6
    `)) as any[];

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện cho slider:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
