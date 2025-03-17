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
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT st.name) as tags
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags st ON str.tag_id = st.tag_id
      WHERE s.story_id = ? AND s.status = 'published'
      GROUP BY s.story_id
    `, [id]) as any[]

    if (!stories.length) {
      return NextResponse.json(
        { error: "Không tìm thấy truyện" },
        { status: 404 }
      )
    }

    // Format lại dữ liệu
    const story = stories[0]
    story.tags = story.tags ? story.tags.split(',') : []

    return NextResponse.json({ story })
  } catch (error) {
    console.error("Lỗi khi lấy thông tin truyện:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 