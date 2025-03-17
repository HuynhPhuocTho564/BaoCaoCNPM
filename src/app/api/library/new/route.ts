/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
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
      WHERE s.status = 'published'
      ORDER BY s.updated_at DESC
      LIMIT 20
    `) as any[]

    return NextResponse.json({ stories })
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện mới:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 