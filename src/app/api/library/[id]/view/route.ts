import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params

    await pool.execute(
      `UPDATE stories SET view_count = view_count + 1 WHERE story_id = ?`,
      [id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Lỗi khi cập nhật lượt xem:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 