/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import pool from "@/lib/db";
import { GoogleDriveService } from "@/services/google-drive.service";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Lấy user_id từ email
    const [users] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [session.user.email]
    ) as any[];

    if (!users.length) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    const userId = users[0].user_id;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryIds = JSON.parse(formData.get('categoryIds') as string);
    const coverImage = formData.get('coverImage') as File;

    // Bắt đầu transaction để lấy story_id trước
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Tạo truyện mới trước để lấy ID
      const [result] = await connection.execute(
        `INSERT INTO stories (
          user_id, 
          title, 
          description,
          status
        ) VALUES (?, ?, ?, 'draft')`,
        [userId, title, description]
      ) as any;

      const storyId = result.insertId;

      // Upload ảnh với story_id
      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const { directLink, fileId } = await GoogleDriveService.uploadFile(
        buffer,
        coverImage.type,
        userId,
        'cover',
        storyId // Truyền storyId vào đây
      );

      // Cập nhật URL ảnh và file_id
      await connection.execute(
        `UPDATE stories SET 
          cover_image = ?,
          cover_file_id = ?
        WHERE story_id = ?`,
        [directLink, fileId, storyId]
      );

      // Thêm categories
      for (const categoryId of categoryIds) {
        await connection.execute(
          'INSERT INTO story_category_relations (story_id, category_id) VALUES (?, ?)',
          [storyId, categoryId]
        );
      }

      await connection.commit();

      return NextResponse.json(
        { message: "Tạo truyện thành công", storyId },
        { status: 201 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Lỗi khi tạo truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi tạo truyện" },
      { status: 500 }
    );
  }
} 