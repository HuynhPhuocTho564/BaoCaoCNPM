import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/revalidate:
 *   get:
 *     summary: Revalidate cache
 *     description: Xóa cache của một đường dẫn cụ thể để cập nhật dữ liệu
 *     tags:
 *       - System
 *     parameters:
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         description: Đường dẫn cần revalidate
 *         example: "/stories"
 *     responses:
 *       200:
 *         description: Kết quả revalidate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revalidated:
 *                   type: boolean
 *                   description: Có revalidate thành công hay không
 *                 now:
 *                   type: number
 *                   description: Timestamp hiện tại
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
  }

  return NextResponse.json({ revalidated: false, now: Date.now() });
}
