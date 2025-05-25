/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";
import crypto from "crypto";

export interface AuthenticatedUser {
  user_id: number;
  username: string;
  email: string;
  avatar?: string;
  has_badge?: boolean;
  auth_type: "session" | "api_key";
  api_key_id?: number;
}

/**
 * Tạo API key mới
 */
export function generateApiKey(): string {
  const prefix = "csa_"; // ChatStoryAI prefix
  const randomBytes = crypto.randomBytes(32).toString("hex");
  return `${prefix}${randomBytes}`;
}

/**
 * Hash API key để lưu vào database
 */
export function hashApiKey(apiKey: string): string {
  const secret = process.env.API_KEY_SECRET || "default-secret";
  return crypto.createHmac("sha256", secret).update(apiKey).digest("hex");
}

/**
 * Xác thực API key từ header
 */
async function authenticateApiKey(
  apiKey: string
): Promise<AuthenticatedUser | null> {
  try {
    const hashedKey = hashApiKey(apiKey);

    const [rows] = await pool.execute(
      `
      SELECT 
        ak.id as api_key_id,
        ak.user_id,
        ak.last_used_at,
        ak.expires_at,
        ak.is_active,
        u.username,
        u.email,
        u.avatar,
        u.has_badge
      FROM api_keys ak
      JOIN users u ON ak.user_id = u.user_id
      WHERE ak.api_key = ? AND ak.is_active = TRUE
    `,
      [hashedKey]
    );

    const apiKeyData = (rows as any[])[0];

    if (!apiKeyData) {
      return null;
    }

    // Kiểm tra expiration
    if (apiKeyData.expires_at && new Date() > new Date(apiKeyData.expires_at)) {
      return null;
    }

    // Cập nhật last_used_at
    await pool.execute(
      "UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?",
      [apiKeyData.api_key_id]
    );

    return {
      user_id: apiKeyData.user_id,
      username: apiKeyData.username,
      email: apiKeyData.email,
      avatar: apiKeyData.avatar,
      has_badge: Boolean(apiKeyData.has_badge),
      auth_type: "api_key",
      api_key_id: apiKeyData.api_key_id,
    };
  } catch (error) {
    console.error("Error authenticating API key:", error);
    return null;
  }
}

/**
 * Xác thực session hiện tại
 */
async function authenticateSession(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    return {
      user_id: parseInt(session.user.id),
      username: session.user.name || "",
      email: session.user.email || "",
      avatar: session.user.avatar,
      has_badge: session.user.hasBadge || false,
      auth_type: "session",
    };
  } catch (error) {
    console.error("Error authenticating session:", error);
    return null;
  }
}

/**
 * Middleware xác thực chính - hỗ trợ cả session và API key
 */
export async function authenticate(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  // Kiểm tra API key trong header trước
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  let apiKey: string | null = null;

  // Lấy API key từ Authorization header (Bearer token) hoặc X-API-Key header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token.startsWith("csa_")) {
      apiKey = token;
    }
  } else if (apiKeyHeader) {
    apiKey = apiKeyHeader;
  }

  // Nếu có API key, xác thực bằng API key
  if (apiKey) {
    return await authenticateApiKey(apiKey);
  }

  // Nếu không có API key, xác thực bằng session
  return await authenticateSession();
}

/**
 * Wrapper function để sử dụng trong API routes
 */
export async function requireAuth(
  request: NextRequest
): Promise<AuthenticatedUser> {
  const user = await authenticate(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
