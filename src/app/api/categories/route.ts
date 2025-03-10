import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [categories] = await pool.execute(
      "SELECT category_id as id, name FROM story_categories ORDER BY name ASC"
    );

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra khi lấy danh sách thể loại" },
      { status: 500 }
    );
  }
} 