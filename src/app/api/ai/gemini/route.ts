/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";

/**
 * @swagger
 * /api/ai/gemini:
 *   get:
 *     summary: Lấy API key Gemini
 *     description: Trả về API key Gemini để sử dụng cho các tính năng AI
 *     tags:
 *       - AI
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API key Gemini
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: Gemini API key
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Chưa cấu hình API key hoặc lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chưa cấu hình API key" },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    console.error("Lỗi khi lấy API key:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
