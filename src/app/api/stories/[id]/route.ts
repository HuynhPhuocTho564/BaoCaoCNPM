/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";
import { GoogleDriveService } from "@/services/google-drive.service";

/**
 * @swagger
 * /api/stories/{id}:
 *   get:
 *     summary: Lấy chi tiết truyện
 *     description: Lấy thông tin chi tiết của một truyện theo ID
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
 *         description: Thông tin chi tiết truyện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 story:
 *                   $ref: '#/components/schemas/Story'
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await requireAuth(request);

    // Lấy thông tin truyện
    const [stories] = (await pool.execute(
      `
      SELECT 
        s.*,
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT str.tag_id) as tag_ids,
        GROUP_CONCAT(DISTINCT st.name) as tags,
        (SELECT COUNT(*) FROM story_favorites WHERE story_id = s.story_id) as favorite_count
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags st ON str.tag_id = st.tag_id
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

    // Format dữ liệu
    const story = stories[0];
    story.tag_ids = story.tag_ids ? story.tag_ids.split(",").map(Number) : [];
    story.tags = story.tags ? story.tags.split(",") : [];

    return NextResponse.json({ story });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy thông tin truyện:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/stories/{id}:
 *   put:
 *     summary: Cập nhật truyện
 *     description: Cập nhật thông tin truyện bao gồm tiêu đề, mô tả, thể loại, tags và ảnh bìa
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
 *               title:
 *                 type: string
 *                 description: Tiêu đề truyện mới
 *               description:
 *                 type: string
 *                 description: Mô tả truyện mới
 *               mainCategoryId:
 *                 type: string
 *                 description: ID thể loại chính mới
 *               tagIds:
 *                 type: string
 *                 description: JSON array của tag IDs mới
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh bìa mới (tùy chọn)
 *             required:
 *               - title
 *               - description
 *               - mainCategoryId
 *               - tagIds
 *     responses:
 *       200:
 *         description: Cập nhật truyện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
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
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const user = await requireAuth(request);

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const mainCategoryId = formData.get("mainCategoryId") as string;
    const tagIds = JSON.parse(formData.get("tagIds") as string);
    const coverImage = formData.get("coverImage") as File;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let coverImageUrl = null;
      let newFileId = null;

      // Upload ảnh mới nếu có
      if (coverImage) {
        // Lấy thông tin ảnh cũ trước
        const [oldStory] = (await connection.execute(
          "SELECT cover_file_id FROM stories WHERE story_id = ?",
          [id]
        )) as any[];

        // Upload ảnh mới trước
        const buffer = Buffer.from(await coverImage.arrayBuffer());
        const { directLink, fileId } = await GoogleDriveService.uploadFile(
          buffer,
          coverImage.type,
          user.user_id,
          "cover",
          parseInt(id)
        );
        coverImageUrl = directLink;
        newFileId = fileId;

        // Chỉ xóa ảnh cũ sau khi upload thành công
        if (
          oldStory[0]?.cover_file_id &&
          oldStory[0].cover_file_id !== newFileId
        ) {
          await GoogleDriveService.deleteFile(oldStory[0].cover_file_id);
        }
      }

      // Cập nhật thông tin truyện
      const updateQuery = `
        UPDATE stories SET 
          title = ?,
          description = ?,
          main_category_id = ?,
          ${coverImageUrl ? "cover_image = ?, cover_file_id = ?," : ""} 
          updated_at = CURRENT_TIMESTAMP
        WHERE story_id = ?
      `;

      const updateParams = coverImageUrl
        ? [title, description, mainCategoryId, coverImageUrl, newFileId, id]
        : [title, description, mainCategoryId, id];

      await connection.execute(updateQuery, updateParams);

      // Cập nhật tags
      await connection.execute(
        "DELETE FROM story_tag_relations WHERE story_id = ?",
        [id]
      );

      for (const tagId of tagIds) {
        await connection.execute(
          "INSERT INTO story_tag_relations (story_id, tag_id) VALUES (?, ?)",
          [id, tagId]
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
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi cập nhật truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi cập nhật truyện" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/stories/{id}:
 *   delete:
 *     summary: Xóa truyện
 *     description: Xóa hoàn toàn một truyện và tất cả dữ liệu liên quan
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
 *         description: ID của truyện cần xóa
 *     responses:
 *       200:
 *         description: Xóa truyện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await requireAuth(request);

    const storyId = id;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Lấy thông tin file_id của ảnh bìa trước khi xóa
      const [stories] = (await connection.execute(
        "SELECT cover_file_id FROM stories WHERE story_id = ?",
        [storyId]
      )) as any[];

      // Xóa ảnh bìa trong Google Drive nếu có
      if (stories[0]?.cover_file_id) {
        await GoogleDriveService.deleteFile(stories[0].cover_file_id);
      }

      // Xóa theo thứ tự để tránh vi phạm ràng buộc khóa ngoại

      // 1. Xóa lịch sử xem
      await connection.execute("DELETE FROM view_history WHERE story_id = ?", [
        storyId,
      ]);

      // 2. Xóa thông báo
      await connection.execute("DELETE FROM notifications WHERE story_id = ?", [
        storyId,
      ]);

      // 3. Xóa bookmark
      await connection.execute(
        "DELETE FROM story_bookmarks WHERE story_id = ?",
        [storyId]
      );

      // 4. Xóa yêu thích
      await connection.execute(
        "DELETE FROM story_favorites WHERE story_id = ?",
        [storyId]
      );

      // 5. Xóa outline
      await connection.execute(
        "DELETE FROM story_outlines WHERE story_id = ?",
        [storyId]
      );

      // 6. Xóa AI generated dialogues
      await connection.execute(
        "DELETE FROM ai_generated_dialogues WHERE story_id = ?",
        [storyId]
      );

      // 7. Xóa các đoạn hội thoại trong chương
      await connection.execute(
        `
        DELETE cd FROM chapter_dialogues cd
        INNER JOIN story_chapters sc ON cd.chapter_id = sc.chapter_id
        WHERE sc.story_id = ?
      `,
        [storyId]
      );

      // 8. Xóa chapter_reads
      await connection.execute(
        `
        DELETE cr FROM chapter_reads cr
        INNER JOIN story_chapters sc ON cr.chapter_id = sc.chapter_id
        WHERE sc.story_id = ?
      `,
        [storyId]
      );

      // 9. Xóa các chương
      await connection.execute(
        "DELETE FROM story_chapters WHERE story_id = ?",
        [storyId]
      );

      // 10. Xóa các nhân vật
      await connection.execute(
        "DELETE FROM story_characters WHERE story_id = ?",
        [storyId]
      );

      // 11. Xóa quan hệ với tags
      await connection.execute(
        "DELETE FROM story_tag_relations WHERE story_id = ?",
        [storyId]
      );

      // 12. Cuối cùng xóa truyện
      await connection.execute("DELETE FROM stories WHERE story_id = ?", [
        storyId,
      ]);

      await connection.commit();
      return NextResponse.json({ message: "Xóa truyện thành công" });
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

    console.error("Lỗi khi xóa truyện:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi xóa truyện" },
      { status: 500 }
    );
  }
}
