/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import pool from "@/lib/db"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id
  
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
        created_at
      FROM story_chapters
      WHERE story_id = ?
      ORDER BY order_number ASC
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