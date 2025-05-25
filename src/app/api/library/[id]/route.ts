/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/library/{id}:
 *   get:
 *     summary: Lấy chi tiết truyện công khai
 *     description: Lấy thông tin chi tiết của một truyện công khai trong thư viện
 *     tags:
 *       - Library
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của truyện
 *     responses:
 *       200:
 *         description: Thông tin chi tiết truyện công khai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 story:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Story'
 *                     - type: object
 *                       properties:
 *                         author_name:
 *                           type: string
 *                           description: Tên tác giả
 *                         author_avatar:
 *                           type: string
 *                           description: Avatar tác giả
 *                         author_has_badge:
 *                           type: boolean
 *                           description: Tác giả có huy hiệu
 *       404:
 *         description: Không tìm thấy truyện
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
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const [stories] = (await pool.execute(
      `
      SELECT 
        s.*,
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id) as favorite_count,
        u.username as author_name,
        u.avatar as author_avatar,
        u.has_badge as author_has_badge
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags t ON str.tag_id = t.tag_id
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.story_id = ?
      GROUP BY s.story_id
    `,
      [id]
    )) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      story: {
        ...stories[0],
        tags: stories[0].tags ? stories[0].tags.split(",") : [],
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin truyện:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
