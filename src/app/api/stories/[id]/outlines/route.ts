/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/stories/{id}/outlines:
 *   get:
 *     summary: Lấy danh sách đại cương truyện
 *     description: Lấy tất cả đại cương của một truyện theo thứ tự
 *     tags:
 *       - Stories
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của truyện
 *     responses:
 *       200:
 *         description: Danh sách đại cương
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 outlines:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Outline'
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
 *   post:
 *     summary: Tạo đại cương mới
 *     description: Thêm đại cương mới cho truyện
 *     tags:
 *       - Stories
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của truyện
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOutlineRequest'
 *     responses:
 *       200:
 *         description: Đại cương được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Outline'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET - Lấy danh sách đại cương
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAuth(request);

    const [outlines] = (await pool.execute(
      `
      SELECT 
        outline_id,
        title,
        description,
        order_number,
        created_at
      FROM story_outlines
      WHERE story_id = ?
      ORDER BY order_number ASC
    `,
      [id]
    )) as any[];

    return NextResponse.json({ outlines });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy danh sách đại cương:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

// POST - Tạo đại cương mới
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { title, description } = await request.json();

    // Bắt đầu transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Lấy order_number lớn nhất hiện tại
      const [maxOrder] = (await connection.execute(
        `
        SELECT MAX(order_number) as max_order
        FROM story_outlines
        WHERE story_id = ?
      `,
        [id]
      )) as any[];

      const nextOrder = (maxOrder[0].max_order || 0) + 1;

      // Tạo đại cương mới
      const [result] = (await connection.execute(
        `
        INSERT INTO story_outlines (
          story_id, 
          title,
          description,
          order_number,
          created_at
        ) VALUES (?, ?, ?, ?, NOW())
      `,
        [id, title, description, nextOrder]
      )) as any[];

      await connection.commit();

      return NextResponse.json({
        outline_id: result.insertId,
        title,
        description,
        order_number: nextOrder,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi tạo đại cương mới:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi tạo đại cương mới" },
      { status: 500 }
    );
  }
}
