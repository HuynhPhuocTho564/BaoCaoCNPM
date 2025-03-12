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
  const { chapterId } = context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { title, status } = data

    await pool.execute(
      `UPDATE story_chapters 
       SET title = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE chapter_id = ?`,
      [title, status, chapterId]
    )

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