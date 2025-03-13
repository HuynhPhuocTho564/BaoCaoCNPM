/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import pool from "@/lib/db"

// GET - Lấy thông tin chương
export async function GET(
  request: Request,
  context: { params: { id: string, chapterId: string } }
) {
  const { chapterId } = context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const [chapters] = await pool.execute(
      `SELECT * FROM story_chapters WHERE chapter_id = ?`,
      [chapterId]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any[]

    if (!chapters.length) {
      return NextResponse.json(
        { error: "Không tìm thấy chương" },
        { status: 404 }
      )
    }

    return NextResponse.json({ chapter: chapters[0] })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// PUT - Cập nhật chương
export async function PUT(
  request: Request,
  context: { params: { id: string, chapterId: string } }
) {
  const { id: storyId, chapterId } = context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, status } = body

    // Lấy thông tin chương hiện tại
    const [currentChapter] = await pool.execute(
      `SELECT status, publish_order FROM story_chapters WHERE chapter_id = ?`,
      [chapterId]
    ) as any[]

    if (!currentChapter.length) {
      return NextResponse.json(
        { error: "Không tìm thấy chương" },
        { status: 404 }
      )
    }

    if (status === 'published') {
      let publishOrder = currentChapter[0].publish_order

      // Nếu chưa có publish_order hoặc đã bị reset về null
      if (!publishOrder) {
        // Lấy publish_order lớn nhất hiện tại
        const [result] = await pool.execute(
          `SELECT MAX(publish_order) as max_order 
           FROM story_chapters 
           WHERE story_id = ? AND status = 'published'`,
          [storyId]
        ) as any[]

        publishOrder = (result[0].max_order || 0) + 1
      }

      // Cập nhật chapter với publish_order
      await pool.execute(
        `UPDATE story_chapters 
         SET title = ?, 
             status = ?,
             publish_order = ?
         WHERE chapter_id = ?`,
        [title, status, publishOrder, chapterId]
      )
    } else {
      // Khi chuyển sang draft, vẫn giữ publish_order
      await pool.execute(
        `UPDATE story_chapters 
         SET title = ?, 
             status = ?
         WHERE chapter_id = ?`,
        [title, status, chapterId]
      )
    }

    return NextResponse.json({ message: "Cập nhật chương thành công" })
  } catch (error) {
    console.error("Lỗi khi cập nhật chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// DELETE - Xóa chương
export async function DELETE(
  request: Request,
  context: { params: { id: string, chapterId: string } }
) {
  const { chapterId } = context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    await pool.execute(
      'DELETE FROM story_chapters WHERE chapter_id = ?',
      [chapterId]
    )

    return NextResponse.json({ message: "Xóa chương thành công" })
  } catch (error) {
    console.error("Lỗi khi xóa chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 