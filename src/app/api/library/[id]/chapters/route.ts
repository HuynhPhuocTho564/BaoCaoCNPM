/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params
  
  try {
    const [chapters] = await pool.execute(`
      SELECT 
        chapter_id,
        title,
        status,
        publish_order
      FROM story_chapters
      WHERE story_id = ? AND status = 'published'
      ORDER BY publish_order ASC
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