/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import pool from "@/lib/db"

// GET - Lấy danh sách chương
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const [chapters] = await pool.execute(`
      SELECT 
        chapter_id,
        title,
        order_number,
        status,
        publish_order,
        created_at
      FROM story_chapters
      WHERE story_id = ?
      ORDER BY 
        CASE 
          WHEN status = 'published' THEN publish_order
          ELSE order_number
        END ASC,
        order_number ASC
    `, [id]) as any[]

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// POST - Tạo chương mới
export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  const { id: storyId } = context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { title, status = 'draft' } = data

    // Lấy order_number lớn nhất hiện tại
    const [maxOrder] = await pool.execute(
      `SELECT MAX(order_number) as max_order 
       FROM story_chapters 
       WHERE story_id = ?`,
      [storyId]
    ) as any[]

    const nextOrder = (maxOrder[0].max_order || 0) + 1

    // Tạo chương mới với order_number tự động tăng
    const [result] = await pool.execute(
      `INSERT INTO story_chapters (story_id, title, status, order_number) 
       VALUES (?, ?, ?, ?)`,
      [storyId, title, status, nextOrder]
    ) as any[]

    return NextResponse.json({ 
      message: "Tạo chương thành công",
      chapterId: result.insertId
    })
  } catch (error) {
    console.error("Lỗi khi tạo chương:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 