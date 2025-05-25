/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/stories/{id}/favorites:
 *   get:
 *     summary: Kiểm tra trạng thái yêu thích
 *     description: Kiểm tra xem người dùng đã yêu thích truyện này chưa
 *     tags:
 *       - Stories
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của truyện
 *     responses:
 *       200:
 *         description: Trạng thái yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorited:
 *                   type: boolean
 *                   description: Đã yêu thích hay chưa
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
 *     summary: Toggle yêu thích truyện
 *     description: Thêm hoặc xóa yêu thích cho truyện
 *     tags:
 *       - Stories
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của truyện
 *     responses:
 *       200:
 *         description: Thao tác yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả
 *                 isFavorited:
 *                   type: boolean
 *                   description: Trạng thái yêu thích mới
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
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

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

    const [favorites] = (await pool.execute(
      "SELECT * FROM story_favorites WHERE user_id = ? AND story_id = ?",
      [users[0].user_id, id]
    )) as any[];

    return NextResponse.json({
      isFavorited: favorites.length > 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

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

    const [favorites] = (await pool.execute(
      "SELECT * FROM story_favorites WHERE user_id = ? AND story_id = ?",
      [users[0].user_id, id]
    )) as any[];

    if (favorites.length > 0) {
      await pool.execute(
        "DELETE FROM story_favorites WHERE user_id = ? AND story_id = ?",
        [users[0].user_id, id]
      );
      return NextResponse.json({ message: "Đã bỏ thích truyện" });
    }

    await pool.execute(
      "INSERT INTO story_favorites (user_id, story_id) VALUES (?, ?)",
      [users[0].user_id, id]
    );

    return NextResponse.json({ message: "Đã thích truyện" });
  } catch (error) {
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
