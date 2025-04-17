/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')?.split(',')

    if (!query && !category && !tags?.length) {
      return NextResponse.json({ stories: [] })
    }

    let sql = `
      SELECT DISTINCT
        s.story_id,
        s.title,
        s.description,
        s.cover_image,
        s.view_count,
        s.updated_at,
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id) as favorite_count,
        u.username as author_name,
        u.avatar as author_avatar,
        u.has_badge as author_has_badge
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags t ON str.tag_id = t.tag_id
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.status = 'published'
    `

    const params: any[] = []

    if (query) {
      sql += ` AND (s.title LIKE ? OR s.description LIKE ?)`
      params.push(`%${query}%`, `%${query}%`)
    }

    if (category) {
      sql += ` AND mc.name = ?`
      params.push(category)
    }

    if (tags?.length) {
      sql += ` AND t.name IN (${tags.map(() => '?').join(',')})`
      params.push(...tags)
    }

    sql += ` GROUP BY s.story_id ORDER BY s.updated_at DESC LIMIT 20`

    const [stories] = await pool.execute(sql, params) as any[]

    return NextResponse.json({
      stories: stories.map((story: any) => ({
        ...story,
        tags: story.tags ? story.tags.split(',') : []
      }))
    })
  } catch (error) {
    console.error("Lỗi khi tìm kiếm truyện:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 