import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

// PUT - Cập nhật dialogue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dialogueId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { dialogueId } = resolvedParams;

    const { content } = await request.json();

    await pool.execute(
      "UPDATE chapter_dialogues SET content = ? WHERE dialogue_id = ?",
      [content, dialogueId]
    );

    return NextResponse.json({ message: "Cập nhật dialogue thành công" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi cập nhật dialogue:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

// DELETE - Xóa dialogue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ dialogueId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { dialogueId } = resolvedParams;

    await pool.execute("DELETE FROM chapter_dialogues WHERE dialogue_id = ?", [
      dialogueId,
    ]);

    return NextResponse.json({ message: "Xóa dialogue thành công" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi xóa dialogue:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
