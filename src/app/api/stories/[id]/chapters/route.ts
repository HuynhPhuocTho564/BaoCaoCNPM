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
  try {
    const { id } = context.params
    const { title, status } = await request.json()

    // Bắt đầu transaction
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // Lấy order_number và publish_order lớn nhất hiện tại
      const [maxOrders] = await connection.execute(`
        SELECT 
          MAX(order_number) as max_order,
          MAX(CASE WHEN status = 'published' THEN publish_order ELSE 0 END) as max_publish
        FROM story_chapters
        WHERE story_id = ?
      `, [id]) as any[]

      const nextOrder = (maxOrders[0].max_order || 0) + 1
      const nextPublish = status === 'published' ? (maxOrders[0].max_publish || 0) + 1 : null

      // Tạo chương mới
      const [result] = await connection.execute(`
        INSERT INTO story_chapters (
          story_id, 
          title, 
          status,
          order_number,
          publish_order,
          created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())
      `, [id, title, status, nextOrder, nextPublish]) as any[]

      await connection.commit()

      return NextResponse.json({
        chapter_id: result.insertId,
        title,
        status,
        order_number: nextOrder,
        publish_order: nextPublish
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Lỗi khi tạo chương mới:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi tạo chương mới" },
      { status: 500 }
    )
  }
} 