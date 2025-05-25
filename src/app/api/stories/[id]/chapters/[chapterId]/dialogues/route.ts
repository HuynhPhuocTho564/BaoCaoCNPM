/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

// GET - Lấy danh sách dialogue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { chapterId } = resolvedParams;

    const [dialogues] = (await pool.execute(
      `
      SELECT dialogue_id, character_id, content, order_number, type
      FROM chapter_dialogues
      WHERE chapter_id = ?
      ORDER BY order_number
    `,
      [chapterId]
    )) as any[];

    return NextResponse.json({ dialogues });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy danh sách dialogue:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

// POST - Thêm dialogue mới
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { chapterId } = resolvedParams;

    const data = await request.json();
    const { character_id, content, order_number, type = "dialogue" } = data;

    // Xử lý character_id cho narration
    const finalCharacterId = type === "narration" ? null : character_id;

    const [result] = (await pool.execute(
      `
      INSERT INTO chapter_dialogues (chapter_id, character_id, content, order_number, type)
      VALUES (?, ?, ?, ?, ?)
    `,
      [chapterId, finalCharacterId, content, order_number, type]
    )) as any[];

    const [dialogue] = (await pool.execute(
      `
      SELECT * FROM chapter_dialogues WHERE dialogue_id = ?
    `,
      [result.insertId]
    )) as any[];

    return NextResponse.json({
      message: "Thêm dialogue thành công",
      dialogue: dialogue[0],
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi thêm dialogue:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
