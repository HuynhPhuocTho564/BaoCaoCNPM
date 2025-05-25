/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-key-auth";
import { ApiKeyService } from "@/services/api-key.service";

/**
 * @swagger
 * /api/user/api-keys/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết API key
 *     description: Trả về thông tin chi tiết của một API key cụ thể
 *     tags:
 *       - API Keys
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của API key
 *     responses:
 *       200:
 *         description: Thông tin API key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiKey'
 *       404:
 *         description: API key không tồn tại
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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const user = await requireAuth(request);
    const apiKeyId = parseInt(resolvedParams.id);

    if (isNaN(apiKeyId)) {
      return NextResponse.json(
        { error: "ID API key không hợp lệ" },
        { status: 400 }
      );
    }

    const apiKey = await ApiKeyService.getApiKeyById(user.user_id, apiKeyId);

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json(apiKey);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi lấy thông tin API key" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user/api-keys/{id}:
 *   patch:
 *     summary: Cập nhật thông tin API key
 *     description: Cập nhật tên, mô tả hoặc thời gian hết hạn của API key
 *     tags:
 *       - API Keys
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên mới của API key
 *               description:
 *                 type: string
 *                 description: Mô tả mới
 *               expires_at:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian hết hạn mới
 *               is_active:
 *                 type: boolean
 *                 description: Trạng thái active/inactive
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: API key không tồn tại
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
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const user = await requireAuth(request);
    const apiKeyId = parseInt(resolvedParams.id);
    const data = await request.json();

    if (isNaN(apiKeyId)) {
      return NextResponse.json(
        { error: "ID API key không hợp lệ" },
        { status: 400 }
      );
    }

    // Validation
    if (
      data.name !== undefined &&
      (!data.name || data.name.trim().length === 0)
    ) {
      return NextResponse.json(
        { error: "Tên API key không được để trống" },
        { status: 400 }
      );
    }

    if (data.name && data.name.length > 100) {
      return NextResponse.json(
        { error: "Tên API key không được vượt quá 100 ký tự" },
        { status: 400 }
      );
    }

    // Kiểm tra expires_at nếu có
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      if (isNaN(expiresAt.getTime()) || expiresAt <= new Date()) {
        return NextResponse.json(
          { error: "Thời gian hết hạn không hợp lệ hoặc đã qua" },
          { status: 400 }
        );
      }
    }

    // Xử lý cập nhật trạng thái riêng
    if (data.is_active !== undefined) {
      await ApiKeyService.updateApiKeyStatus(
        user.user_id,
        apiKeyId,
        data.is_active
      );
    }

    // Xử lý cập nhật thông tin khác
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined)
      updateData.description = data.description?.trim();
    if (data.expires_at !== undefined) updateData.expires_at = data.expires_at;

    if (Object.keys(updateData).length > 0) {
      await ApiKeyService.updateApiKey(user.user_id, apiKeyId, updateData);
    }

    return NextResponse.json({
      message: "API key được cập nhật thành công",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi cập nhật API key" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user/api-keys/{id}:
 *   delete:
 *     summary: Xóa API key
 *     description: Xóa vĩnh viễn một API key
 *     tags:
 *       - API Keys
 *     security:
 *       - sessionAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của API key cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: API key không tồn tại
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const user = await requireAuth(request);
    const apiKeyId = parseInt(resolvedParams.id);

    if (isNaN(apiKeyId)) {
      return NextResponse.json(
        { error: "ID API key không hợp lệ" },
        { status: 400 }
      );
    }

    await ApiKeyService.deleteApiKey(user.user_id, apiKeyId);

    return NextResponse.json({
      message: "API key đã được xóa thành công",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi xóa API key" },
      { status: 500 }
    );
  }
}
