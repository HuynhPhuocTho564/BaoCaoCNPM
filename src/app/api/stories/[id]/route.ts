/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import pool from "@/lib/db";
import { GoogleDriveService } from "@/services/google-drive.service";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Lấy thông tin truyện và categories
    const [stories] = await pool.execute(`
      SELECT 
        s.*,
        GROUP_CONCAT(scr.category_id) as category_ids
      FROM stories s
      LEFT JOIN story_category_relations scr ON s.story_id = scr.story_id
      WHERE s.story_id = ?
      GROUP BY s.story_id
    `, [id]) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      );
    }

    const story = stories[0];
    story.category_ids = story.category_ids 
      ? story.category_ids.split(',').map(Number)
      : [];

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryIds = JSON.parse(formData.get('categoryIds') as string);
    const coverImage = formData.get('coverImage') as File | null;

    // Lấy thông tin truyện cũ
    const [stories] = await pool.execute(
      'SELECT user_id, cover_file_id FROM stories WHERE story_id = ?',
      [id]
    ) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      );
    }

    const story = stories[0];
    let coverImageUrl = null;
    let newFileId = null;

    // Upload ảnh mới nếu có
    if (coverImage && coverImage.size > 0) {
      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const storyId = Number(id);
      
      if (isNaN(storyId)) {
        throw new Error('Invalid story ID');
      }

      const { directLink, fileId } = await GoogleDriveService.uploadFile(
        buffer,
        coverImage.type,
        story.user_id,
        'cover',
        storyId
      );
      coverImageUrl = directLink;
      newFileId = fileId;

      // Xóa ảnh cũ nếu có
      if (story.cover_file_id) {
        await GoogleDriveService.deleteFile(story.cover_file_id);
      }
    }

    // Bắt đầu transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Cập nhật thông tin truyện
      await connection.execute(
        `UPDATE stories SET 
          title = ?,
          description = ?,
          ${coverImageUrl ? 'cover_image = ?, cover_file_id = ?,' : ''} 
          updated_at = CURRENT_TIMESTAMP
        WHERE story_id = ?`,
        coverImageUrl 
          ? [title, description, coverImageUrl, newFileId, id]
          : [title, description, id]
      );

      // Cập nhật categories
      await connection.execute(
        'DELETE FROM story_category_relations WHERE story_id = ?',
        [id]
      );

      for (const categoryId of categoryIds) {
        await connection.execute(
          'INSERT INTO story_category_relations (story_id, category_id) VALUES (?, ?)',
          [id, categoryId]
        );
      }

      await connection.commit();

      return NextResponse.json(
        { message: "Cập nhật truyện thành công" },
        { status: 200 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi cập nhật truyện" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      );
    }

    // Lấy thông tin truyện để kiểm tra quyền sở hữu và file ảnh
    const [stories] = await pool.execute(
      'SELECT user_id, cover_file_id FROM stories WHERE story_id = ?',
      [id]
    ) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      );
    }

    const story = stories[0];

    // Xóa file ảnh bìa trên Google Drive nếu có
    if (story.cover_file_id) {
      await GoogleDriveService.deleteFile(story.cover_file_id);
    }

    // Bắt đầu transaction
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Xóa các liên kết category
      await connection.execute(
        'DELETE FROM story_category_relations WHERE story_id = ?',
        [id]
      );

      // Xóa truyện
      await connection.execute(
        'DELETE FROM stories WHERE story_id = ?',
        [id]
      );

      await connection.commit();

      return NextResponse.json(
        { message: "Xóa truyện thành công" },
        { status: 200 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Lỗi khi xóa truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi xóa truyện" },
      { status: 500 }
    );
  }
} 