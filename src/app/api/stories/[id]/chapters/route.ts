/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/stories/{id}/chapters:
 *   get:
 *     summary: Lấy danh sách chương
 *     description: Lấy danh sách tất cả chương của một truyện
 *     tags:
 *       - Chapters
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Lọc theo trạng thái chương
 *     responses:
 *       200:
 *         description: Danh sách chương
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chapters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chapter'
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
// GET - Lấy danh sách chương
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    await requireAuth(request);

    let query = `
      SELECT 
        chapter_id,
        title,
        summary,
        order_number,
        status,
        publish_order,
        created_at
      FROM story_chapters
      WHERE story_id = ?
    `;

    const queryParams = [id];

    if (status) {
      query += ` AND status = ?`;
      queryParams.push(status);
    }

    query += ` ORDER BY 
      CASE 
        WHEN status = 'published' THEN publish_order
        ELSE order_number
      END ASC,
      order_number ASC`;

    const [chapters] = (await pool.execute(query, queryParams)) as any[];

    return NextResponse.json({ chapters });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy danh sách chương:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/stories/{id}/chapters:
 *   post:
 *     summary: Tạo chương mới
 *     description: Tạo một chương mới cho truyện
 *     tags:
 *       - Chapters
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề chương
 *               summary:
 *                 type: string
 *                 description: Tóm tắt chương
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 description: Trạng thái chương
 *             required:
 *               - title
 *               - summary
 *               - status
 *           example:
 *             title: "Chương 1: Khởi đầu"
 *             summary: "Tóm tắt nội dung chương"
 *             status: "draft"
 *     responses:
 *       200:
 *         description: Tạo chương thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
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
// POST - Tạo chương mới
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { title, summary, status } = await request.json();

    // Bắt đầu transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Lấy order_number và publish_order lớn nhất hiện tại
      const [maxOrders] = (await connection.execute(
        `
        SELECT 
          MAX(order_number) as max_order,
          MAX(CASE WHEN status = 'published' THEN publish_order ELSE 0 END) as max_publish
        FROM story_chapters
        WHERE story_id = ?
      `,
        [id]
      )) as any[];

      const nextOrder = (maxOrders[0].max_order || 0) + 1;
      const nextPublish =
        status === "published" ? (maxOrders[0].max_publish || 0) + 1 : null;

      // Tạo chương mới với trường summary
      const [result] = (await connection.execute(
        `
        INSERT INTO story_chapters (
          story_id, 
          title,
          summary, 
          status,
          order_number,
          publish_order,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
        [id, title, summary, status, nextOrder, nextPublish]
      )) as any[];

      await connection.commit();

      return NextResponse.json({
        chapter_id: result.insertId,
        title,
        summary,
        status,
        order_number: nextOrder,
        publish_order: nextPublish,
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

    console.error("Lỗi khi tạo chương mới:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi tạo chương mới" },
      { status: 500 }
    );
  }
}
