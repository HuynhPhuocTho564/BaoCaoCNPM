/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params

    const [stories] = await pool.execute(`
      SELECT 
        s.story_id,
        s.title,
        s.description,
        s.cover_image,
        s.view_count,
        s.updated_at,
        mc.name as main_category
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      WHERE s.story_id = ? AND s.status = 'published'
    `, [id]) as any[]

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      )
    }

    return NextResponse.json({ story: stories[0] })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin truyện:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 