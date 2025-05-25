/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/stories:
 *   get:
 *     summary: Lấy danh sách truyện của người dùng
 *     description: Trả về danh sách tất cả truyện thuộc về người dùng hiện tại
 *     tags:
 *       - Stories
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách truyện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
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
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const userId = user.user_id;

    // Lấy danh sách truyện
    const [stories] = (await pool.execute(
      `
      SELECT 
        s.story_id,
        s.title,
        s.description,
        s.cover_image,
        s.status,
        s.view_count,
        s.updated_at,
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT st.name) as tags,
        COUNT(DISTINCT sf.user_id) as favorite_count
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags st ON str.tag_id = st.tag_id
      LEFT JOIN story_favorites sf ON s.story_id = sf.story_id
      WHERE s.user_id = ?
      GROUP BY s.story_id
      ORDER BY s.updated_at DESC
    `,
      [userId]
    )) as any[];

    // Format lại dữ liệu
    const formattedStories = stories.map((story: any) => ({
      ...story,
      tags: story.tags ? story.tags.split(",") : [],
      favorite_count: Number(story.favorite_count),
    }));

    return NextResponse.json({ stories: formattedStories });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy danh sách truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi lấy danh sách truyện" },
      { status: 500 }
    );
  }
}
