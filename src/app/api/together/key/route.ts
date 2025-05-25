import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/together/key:
 *   get:
 *     summary: Lấy Together AI API key
 *     description: Trả về API key Together AI để sử dụng cho các tính năng AI
 *     tags:
 *       - AI
 *     responses:
 *       200:
 *         description: Together AI API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: Together AI API key
 *       500:
 *         description: Chưa cấu hình API key hoặc lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.TOGETHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "TOGETHER_API_KEY không được cấu hình trong biến môi trường" },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error("Lỗi khi lấy Together API key:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy API key" },
      { status: 500 }
    );
  }
}
