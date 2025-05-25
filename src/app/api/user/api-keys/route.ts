/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import { ApiKeyService } from "@/services/api-key.service";

/**
 * @swagger
 * /api/user/api-keys:
 *   get:
 *     summary: Lấy danh sách API keys của user
 *     description: Trả về danh sách tất cả API keys của user hiện tại
 *     tags:
 *       - API Keys
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKeys:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApiKey'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const apiKeys = await ApiKeyService.getUserApiKeys(user.user_id);

    return NextResponse.json({
      apiKeys
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Chưa xác thực' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Đã xảy ra lỗi khi lấy danh sách API keys' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user/api-keys:
 *   post:
 *     summary: Tạo API key mới
 *     description: Tạo một API key mới cho user hiện tại
 *     tags:
 *       - API Keys
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của API key
 *                 example: "My App API Key"
 *               description:
 *                 type: string
 *                 description: Mô tả cho API key
 *                 example: "API key cho ứng dụng mobile"
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian hết hạn (optional)
 *                 example: "2024-12-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: API key được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 apiKey:
 *                   type: string
 *                   description: API key mới (chỉ hiển thị một lần)
 *                 id:
 *                   type: number
 *                   description: ID của API key
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const data = await request.json();

    // Validation
    if (!data.name || data.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tên API key là bắt buộc' },
        { status: 400 }
      );
    }

    if (data.name.length > 100) {
      return NextResponse.json(
        { error: 'Tên API key không được vượt quá 100 ký tự' },
        { status: 400 }
      );
    }

    // Kiểm tra expires_at nếu có
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      if (isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
        return NextResponse.json(
          { error: 'Thời gian hết hạn không hợp lệ hoặc đã qua' },
          { status: 400 }
        );
      }
    }

    const result = await ApiKeyService.createApiKey(user.user_id, {
      name: data.name.trim(),
      description: data.description?.trim(),
      expires_at: data.expires_at
    });

    return NextResponse.json({
      message: 'API key được tạo thành công',
      apiKey: result.apiKey,
      id: result.id
    }, { status: 201 });

  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Chưa xác thực' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Đã xảy ra lỗi khi tạo API key' },
      { status: 500 }
    );
  }
}
