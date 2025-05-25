/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * @swagger
 * /api/library/search:
 *   get:
 *     summary: Tìm kiếm truyện
 *     description: Tìm kiếm truyện với nhiều bộ lọc và tùy chọn sắp xếp
 *     tags:
 *       - Library
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *       - in: query
 *         name: useAI
 *         schema:
 *           type: boolean
 *         description: Sử dụng AI để tìm kiếm
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo thể loại
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Lọc theo tags (phân cách bằng dấu phẩy)
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [today, week, month, year, all]
 *         description: Lọc theo khoảng thời gian
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Từ ngày
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Đến ngày
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [updated, views, favorites, views_today, favorites_today]
 *         description: Sắp xếp theo
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Thứ tự sắp xếp
 *       - in: query
 *         name: minViews
 *         schema:
 *           type: integer
 *         description: Số lượt xem tối thiểu
 *       - in: query
 *         name: minFavorites
 *         schema:
 *           type: integer
 *         description: Số lượt thích tối thiểu
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const useAI = searchParams.get("useAI") === "true";
    const category = searchParams.get("category");
    const tags = searchParams.get("tags")?.split(",");

    // Các bộ lọc thời gian
    const timeRange = searchParams.get("timeRange"); // today, week, month, year, all
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    // Các bộ lọc số liệu
    const sortBy = searchParams.get("sortBy"); // updated, views, favorites, views_today, favorites_today
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const minViews = searchParams.get("minViews");
    const minFavorites = searchParams.get("minFavorites");

    // Nếu dùng AI, chỉ trả về danh sách truyện để xử lý trên client
    if (useAI) {
      const [publishedStories] = (await pool.execute(
        `SELECT 
          s.story_id,
          s.title,
          s.description,
          s.cover_image,
          s.view_count,
          s.updated_at,
          mc.name as main_category,
          GROUP_CONCAT(DISTINCT t.name) as tags,
          COUNT(DISTINCT sf.user_id) as favorite_count,
          COUNT(DISTINCT CASE WHEN DATE(sf.created_at) = CURDATE() THEN sf.user_id END) as favorites_today,
          COUNT(DISTINCT CASE WHEN sf.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN sf.user_id END) as favorites_week
        FROM stories s
        LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
        LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
        LEFT JOIN story_tags t ON str.tag_id = t.tag_id
        LEFT JOIN story_favorites sf ON s.story_id = sf.story_id
        WHERE s.status = 'published'
        GROUP BY s.story_id`
      )) as any[];

      return NextResponse.json({ stories: publishedStories });
    }

    // Tìm kiếm thông thường nếu không dùng AI
    let sql = `
      SELECT DISTINCT
        s.story_id,
        s.title,
        s.description,
        s.cover_image,
        s.view_count,
        s.updated_at,
        mc.name as main_category,
        GROUP_CONCAT(DISTINCT t.name) as tags,
        (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id) as favorite_count,
        (SELECT COUNT(*) FROM view_history vh WHERE vh.story_id = s.story_id AND DATE(vh.view_date) = CURDATE()) as views_today,
        (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id AND DATE(sf.created_at) = CURDATE()) as favorites_today,
        (SELECT COUNT(*) FROM view_history vh WHERE vh.story_id = s.story_id AND vh.view_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as views_week,
        (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id AND sf.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as favorites_week,
        (SELECT COUNT(*) FROM view_history vh WHERE vh.story_id = s.story_id AND vh.view_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as views_month,
        (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id AND sf.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as favorites_month,
        u.username as author_name,
        u.avatar as author_avatar,
        u.has_badge as author_has_badge
      FROM stories s
      LEFT JOIN main_categories mc ON s.main_category_id = mc.category_id
      LEFT JOIN story_tag_relations str ON s.story_id = str.story_id
      LEFT JOIN story_tags t ON str.tag_id = t.tag_id
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.status = 'published'
    `;

    const params: any[] = [];

    // Điều kiện tìm kiếm cơ bản
    if (query) {
      sql += ` AND (s.title LIKE ? OR s.description LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    if (category) {
      sql += ` AND mc.name = ?`;
      params.push(category);
    }

    if (tags?.length) {
      sql += ` AND t.name IN (${tags.map(() => "?").join(",")})`;
      params.push(...tags);
    }

    // Điều kiện thời gian
    if (timeRange) {
      switch (timeRange) {
        case "today":
          sql += ` AND DATE(s.updated_at) = CURDATE()`;
          break;
        case "week":
          sql += ` AND s.updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
          break;
        case "month":
          sql += ` AND s.updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
          break;
        case "year":
          sql += ` AND s.updated_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)`;
          break;
      }
    }

    if (fromDate) {
      sql += ` AND DATE(s.updated_at) >= ?`;
      params.push(fromDate);
    }

    if (toDate) {
      sql += ` AND DATE(s.updated_at) <= ?`;
      params.push(toDate);
    }

    // Điều kiện số liệu
    if (minViews) {
      sql += ` AND s.view_count >= ?`;
      params.push(parseInt(minViews));
    }

    if (minFavorites) {
      sql += ` AND (SELECT COUNT(*) FROM story_favorites sf WHERE sf.story_id = s.story_id) >= ?`;
      params.push(parseInt(minFavorites));
    }

    sql += ` GROUP BY s.story_id`;

    // Sắp xếp
    sql += ` ORDER BY `;
    switch (sortBy) {
      case "views":
        sql += `s.view_count`;
        break;
      case "favorites":
        sql += `favorite_count`;
        break;
      case "views_today":
        sql += `views_today`;
        break;
      case "favorites_today":
        sql += `favorites_today`;
        break;
      case "views_week":
        sql += `views_week`;
        break;
      case "favorites_week":
        sql += `favorites_week`;
        break;
      case "views_month":
        sql += `views_month`;
        break;
      case "favorites_month":
        sql += `favorites_month`;
        break;
      default:
        sql += `s.updated_at`;
    }
    sql += ` ${sortOrder.toUpperCase()} LIMIT 20`;

    const [stories] = (await pool.execute(sql, params)) as any[];

    return NextResponse.json({
      stories: stories.map((story: any) => ({
        ...story,
        tags: story.tags ? story.tags.split(",") : [],
      })),
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm truyện:", error);
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
