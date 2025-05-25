/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách thể loại và tag
 *     description: Trả về danh sách tất cả thể loại chính và tag có sẵn trong hệ thống
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Danh sách thể loại và tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mainCategories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                   description: Danh sách thể loại chính
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *                   description: Danh sách tag
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
  try {
    // Lấy danh sách thể loại chính
    const [mainCategories] = (await pool.execute(`
      SELECT 
        category_id as id,
        name,
        description 
      FROM main_categories 
      ORDER BY name ASC
    `)) as any[];

    // Lấy danh sách tag
    const [tags] = (await pool.execute(`
      SELECT 
        tag_id as id,
        name,
        description
      FROM story_tags 
      ORDER BY name ASC
    `)) as any[];

    return NextResponse.json({
      mainCategories,
      tags,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
