import { NextResponse } from 'next/server';
import specs from '@/lib/swagger';

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: Lấy OpenAPI specification
 *     description: Trả về OpenAPI specification cho tất cả API endpoints
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
  return NextResponse.json(specs);
}
