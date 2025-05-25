/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import pool from "@/lib/db";

// GET - Lấy thông tin đại cương
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outlineId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { outlineId } = resolvedParams;

    const [outlines] = (await pool.execute(
      `
      SELECT 
        outline_id,
        title,
        description,
        order_number
      FROM story_outlines
      WHERE outline_id = ?
    `,
      [outlineId]
    )) as any[];

    if (!outlines.length) {
      return NextResponse.json(
        { error: "Không tìm thấy đại cương" },
        { status: 404 }
      );
    }

    return NextResponse.json({ outline: outlines[0] });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy thông tin đại cương:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

// PUT - Cập nhật đại cương
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outlineId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { outlineId } = resolvedParams;

    const { title, description } = await request.json();

    await pool.execute(
      `UPDATE story_outlines 
       SET title = ?, 
           description = ?
       WHERE outline_id = ?`,
      [title, description, outlineId]
    );

    return NextResponse.json({
      message: "Cập nhật đại cương thành công",
      outline: {
        outline_id: parseInt(outlineId),
        title,
        description,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi cập nhật đại cương:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}

// DELETE - Xóa đại cương
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outlineId: string }> }
) {
  try {
    await requireAuth(request);

    const resolvedParams = await params;
    const { outlineId } = resolvedParams;

    await pool.execute("DELETE FROM story_outlines WHERE outline_id = ?", [
      outlineId,
    ]);

    return NextResponse.json({ message: "Xóa đại cương thành công" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi xóa đại cương:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
