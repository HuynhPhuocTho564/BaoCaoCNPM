import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ dialogueId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { dialogueId } = resolvedParams;

    const { new_order } = await request.json();

    // Cập nhật order_number của dialogue
    await pool.execute(
      "UPDATE chapter_dialogues SET order_number = ? WHERE dialogue_id = ?",
      [new_order, dialogueId]
    );

    return NextResponse.json({ message: "Di chuyển dialogue thành công" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi di chuyển dialogue:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
