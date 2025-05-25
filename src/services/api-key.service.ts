/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import pool from "@/lib/db";
import { generateApiKey, hashApiKey } from "@/lib/api-key-auth";

export interface ApiKey {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  api_key_preview: string; // Chỉ hiển thị một phần của key
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  is_active: boolean;
}

export interface CreateApiKeyData {
  name: string;
  description?: string;
  expires_at?: string;
}

export class ApiKeyService {
  /**
   * Tạo API key mới cho user
   */
  static async createApiKey(
    userId: number,
    data: CreateApiKeyData
  ): Promise<{ apiKey: string; id: number }> {
    try {
      // Kiểm tra số lượng API keys hiện có (giới hạn 10 keys per user)
      const [countResult] = await pool.execute(
        "SELECT COUNT(*) as count FROM api_keys WHERE user_id = ? AND is_active = TRUE",
        [userId]
      );

      const count = (countResult as any[])[0].count;
      if (count >= 10) {
        throw new Error("Bạn đã đạt giới hạn tối đa 10 API keys");
      }

      // Tạo API key mới
      const apiKey = generateApiKey();
      const hashedKey = hashApiKey(apiKey);

      // Lưu vào database
      const [result] = await pool.execute(
        `
        INSERT INTO api_keys (user_id, api_key, name, description, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          userId,
          hashedKey,
          data.name,
          data.description || null,
          data.expires_at || null,
        ]
      );

      const apiKeyId = (result as any).insertId;

      return {
        apiKey, // Trả về API key gốc (chỉ lần này)
        id: apiKeyId,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Lấy danh sách API keys của user
   */
  static async getUserApiKeys(userId: number): Promise<ApiKey[]> {
    try {
      const [rows] = await pool.execute(
        `
        SELECT 
          id,
          user_id,
          name,
          description,
          created_at,
          expires_at,
          last_used_at,
          is_active
        FROM api_keys 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `,
        [userId]
      );

      const apiKeys = (rows as any[]).map((row) => ({
        ...row,
        api_key_preview: `csa_${"*".repeat(8)}...${row.id
          .toString()
          .padStart(4, "0")}`, // Preview format
        is_active: Boolean(row.is_active),
      }));

      return apiKeys;
    } catch (error: any) {
      throw new Error("Lỗi khi lấy danh sách API keys");
    }
  }

  /**
   * Xóa API key
   */
  static async deleteApiKey(userId: number, apiKeyId: number): Promise<void> {
    try {
      const [result] = await pool.execute(
        "DELETE FROM api_keys WHERE id = ? AND user_id = ?",
        [apiKeyId, userId]
      );

      if ((result as any).affectedRows === 0) {
        throw new Error("API key không tồn tại hoặc bạn không có quyền xóa");
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái API key (active/inactive)
   */
  static async updateApiKeyStatus(
    userId: number,
    apiKeyId: number,
    isActive: boolean
  ): Promise<void> {
    try {
      const [result] = await pool.execute(
        "UPDATE api_keys SET is_active = ? WHERE id = ? AND user_id = ?",
        [isActive, apiKeyId, userId]
      );

      if ((result as any).affectedRows === 0) {
        throw new Error(
          "API key không tồn tại hoặc bạn không có quyền cập nhật"
        );
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin API key
   */
  static async updateApiKey(
    userId: number,
    apiKeyId: number,
    data: Partial<CreateApiKeyData>
  ): Promise<void> {
    try {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (data.name !== undefined) {
        updateFields.push("name = ?");
        updateValues.push(data.name);
      }

      if (data.description !== undefined) {
        updateFields.push("description = ?");
        updateValues.push(data.description);
      }

      if (data.expires_at !== undefined) {
        updateFields.push("expires_at = ?");
        updateValues.push(data.expires_at);
      }

      if (updateFields.length === 0) {
        throw new Error("Không có dữ liệu để cập nhật");
      }

      updateValues.push(apiKeyId, userId);

      const [result] = await pool.execute(
        `UPDATE api_keys SET ${updateFields.join(
          ", "
        )} WHERE id = ? AND user_id = ?`,
        updateValues
      );

      if ((result as any).affectedRows === 0) {
        throw new Error(
          "API key không tồn tại hoặc bạn không có quyền cập nhật"
        );
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Lấy thông tin chi tiết một API key
   */
  static async getApiKeyById(
    userId: number,
    apiKeyId: number
  ): Promise<ApiKey | null> {
    try {
      const [rows] = await pool.execute(
        `
        SELECT 
          id,
          user_id,
          name,
          description,
          created_at,
          expires_at,
          last_used_at,
          is_active
        FROM api_keys 
        WHERE id = ? AND user_id = ?
      `,
        [apiKeyId, userId]
      );

      const apiKeyData = (rows as any[])[0];

      if (!apiKeyData) {
        return null;
      }

      return {
        ...apiKeyData,
        api_key_preview: `csa_${"*".repeat(8)}...${apiKeyData.id
          .toString()
          .padStart(4, "0")}`,
        is_active: Boolean(apiKeyData.is_active),
      };
    } catch (error: any) {
      throw new Error("Lỗi khi lấy thông tin API key");
    }
  }
}
