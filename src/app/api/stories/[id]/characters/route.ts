/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";
import { GoogleDriveService } from "@/services/google-drive.service";
import { ResultSetHeader } from "mysql2";

/**
 * @swagger
 * /api/stories/{id}/characters:
 *   get:
 *     summary: Lấy danh sách nhân vật
 *     description: Lấy tất cả nhân vật của một truyện
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
 *         description: Danh sách nhân vật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 characters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Character'
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
 *     summary: Tạo nhân vật mới
 *     description: Thêm nhân vật mới cho truyện với ảnh đại diện
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên nhân vật
 *               description:
 *                 type: string
 *                 description: Mô tả nhân vật
 *               role:
 *                 type: string
 *                 enum: [main, supporting]
 *                 description: Vai trò nhân vật
 *               gender:
 *                 type: string
 *                 description: Giới tính
 *               birthday:
 *                 type: string
 *                 description: Ngày sinh
 *               height:
 *                 type: integer
 *                 description: Chiều cao (cm)
 *               weight:
 *                 type: integer
 *                 description: Cân nặng (kg)
 *               personality:
 *                 type: string
 *                 description: Tính cách
 *               appearance:
 *                 type: string
 *                 description: Ngoại hình
 *               background:
 *                 type: string
 *                 description: Lý lịch
 *               avatarImage:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện nhân vật
 *             required: ["name", "description", "role"]
 *     responses:
 *       200:
 *         description: Tạo nhân vật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo nhân vật thành công"
 *       400:
 *         description: Truyện đã có nhân vật chính
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await requireAuth(request);

    const [characters] = (await pool.execute(
      `
      SELECT 
        character_id,
        name,
        avatar_image,
        description,
        role
      FROM story_characters
      WHERE story_id = ?
      ORDER BY CASE 
        WHEN role = 'main' THEN 0 
        ELSE 1 
      END, 
      character_id DESC
    `,
      [id]
    )) as any[];

    return NextResponse.json({ characters });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy danh sách nhân vật:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

// POST - Tạo nhân vật mới
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id: storyId } = resolvedParams;

  try {
    await requireAuth(request);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const role = formData.get("role") as "main" | "supporting";
    const avatarImage = formData.get("avatarImage") as File;
    const gender = formData.get("gender") as string;
    const birthday = formData.get("birthday") as string;
    const height = parseInt(formData.get("height") as string) || null;
    const weight = parseInt(formData.get("weight") as string) || null;
    const personality = formData.get("personality") as string;
    const appearance = formData.get("appearance") as string;
    const background = formData.get("background") as string;

    // Kiểm tra nhân vật chính
    if (role === "main") {
      const [existingMain] = (await pool.execute(
        `SELECT character_id FROM story_characters WHERE story_id = ? AND role = 'main'`,
        [storyId]
      )) as any[];

      if (existingMain.length > 0) {
        return NextResponse.json(
          { error: "Truyện này đã có nhân vật chính" },
          { status: 400 }
        );
      }
    }

    // Tạo nhân vật với các trường mới
    const [result] = (await pool.execute(
      `INSERT INTO story_characters 
       (story_id, name, description, role, gender, birthday, height, weight, 
        personality, appearance, background) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        storyId,
        name,
        description,
        role,
        gender,
        birthday,
        height,
        weight,
        personality,
        appearance,
        background,
      ]
    )) as [ResultSetHeader, any];

    // Upload ảnh nếu có
    if (avatarImage && avatarImage.size > 0) {
      const buffer = Buffer.from(await avatarImage.arrayBuffer());
      const { directLink, fileId: newFileId } =
        await GoogleDriveService.uploadFile(
          buffer,
          avatarImage.type,
          parseInt(storyId),
          "character-avatar",
          parseInt(storyId),
          result.insertId
        );

      await pool.execute(
        `UPDATE story_characters 
         SET avatar_image = ?, avatar_file_id = ? 
         WHERE character_id = ?`,
        [directLink, newFileId, result.insertId]
      );
    }

    return NextResponse.json({ message: "Tạo nhân vật thành công" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi tạo nhân vật:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
