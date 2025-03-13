/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import pool from "@/lib/db";
import { GoogleDriveService } from "@/services/google-drive.service";

export async function GET(
  request: Request,
<<<<<<< HEAD
  context: { params: { id: string } }
=======
  context: { params: Promise<{ id: string }> }
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
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

<<<<<<< HEAD
    // Lấy thông tin truyện
    const [stories] = await pool.execute(`
      SELECT 
        s.*,
        mc.name as main_category_name,
        GROUP_CONCAT(DISTINCT str.tag_id) as tag_ids
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
=======
    // Lấy thông tin truyện và categories
    const [stories] = await pool.execute(`
      SELECT 
        s.*,
        GROUP_CONCAT(scr.category_id) as category_ids
      FROM stories s
      LEFT JOIN story_category_relations scr ON s.story_id = scr.story_id
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
      WHERE s.story_id = ?
      GROUP BY s.story_id
    `, [id]) as any[];

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      );
    }

<<<<<<< HEAD
    // Format dữ liệu
    const story = stories[0];
    story.tag_ids = story.tag_ids 
      ? story.tag_ids.split(',').map(Number)
=======
    const story = stories[0];
    story.category_ids = story.category_ids 
      ? story.category_ids.split(',').map(Number)
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
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
<<<<<<< HEAD
  context: { params: { id: string } }
=======
  context: { params: Promise<{ id: string }> }
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
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
<<<<<<< HEAD
    const mainCategoryId = formData.get('mainCategoryId') as string;
    const tagIds = JSON.parse(formData.get('tagIds') as string);
    const coverImage = formData.get('coverImage') as File;

=======
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
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

<<<<<<< HEAD
      let coverImageUrl = null;
      let newFileId = null;

      // Upload ảnh mới nếu có
      if (coverImage && coverImage.size > 0) {
        const [users] = await connection.execute(
          'SELECT user_id FROM users WHERE email = ?',
          [session.user.email]
        ) as any[];

        const buffer = Buffer.from(await coverImage.arrayBuffer());
        const { directLink, fileId } = await GoogleDriveService.uploadFile(
          buffer,
          coverImage.type,
          users[0].user_id,
          'cover',
          parseInt(id)
        );
        coverImageUrl = directLink;
        newFileId = fileId;

        // Xóa ảnh cũ nếu có
        const [oldStory] = await connection.execute(
          'SELECT cover_file_id FROM stories WHERE story_id = ?',
          [id]
        ) as any[];

        if (oldStory[0]?.cover_file_id) {
          await GoogleDriveService.deleteFile(oldStory[0].cover_file_id);
        }
      }

=======
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
      // Cập nhật thông tin truyện
      await connection.execute(
        `UPDATE stories SET 
          title = ?,
          description = ?,
<<<<<<< HEAD
          main_category_id = ?,
=======
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
          ${coverImageUrl ? 'cover_image = ?, cover_file_id = ?,' : ''} 
          updated_at = CURRENT_TIMESTAMP
        WHERE story_id = ?`,
        coverImageUrl 
<<<<<<< HEAD
          ? [title, description, mainCategoryId, coverImageUrl, newFileId, id]
          : [title, description, mainCategoryId, id]
      );

      // Cập nhật tags
      await connection.execute(
        'DELETE FROM story_tag_relations WHERE story_id = ?',
        [id]
      );

      for (const tagId of tagIds) {
        await connection.execute(
          'INSERT INTO story_tag_relations (story_id, tag_id) VALUES (?, ?)',
          [id, tagId]
=======
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
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
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
<<<<<<< HEAD
        'DELETE FROM story_tag_relations WHERE story_id = ?',
=======
        'DELETE FROM story_category_relations WHERE story_id = ?',
>>>>>>> f175590d4ceac2a12d2829e33363f1c2e6143dbf
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