/**
 * Module đăng ký công cụ MCP cho ChatStoryAI
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as chatStoryAITools from "../tools/chatstoryai.js";

/**
 * Đăng ký các công cụ MCP cho ChatStoryAI
 * @param server Server MCP
 */
export function registerChatStoryAITools(server: McpServer) {
  // ===== STORIES MANAGEMENT =====

  // Lấy danh sách truyện
  server.tool(
    "getStories",
    "Lấy danh sách tất cả truyện của người dùng",
    {},
    async () => {
      try {
        const data = await chatStoryAITools.getStories();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi lấy danh sách truyện: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );

  // Lấy chi tiết truyện
  server.tool(
    "getStoryDetail",
    "Lấy thông tin chi tiết của một truyện",
    {
      storyId: z.number().describe("ID của truyện"),
    },
    async ({ storyId }) => {
      try {
        const data = await chatStoryAITools.getStoryDetail(storyId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi lấy chi tiết truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Tạo truyện mới
  server.tool(
    "createStory",
    "Tạo một truyện mới",
    {
      title: z.string().describe("Tiêu đề truyện"),
      description: z.string().describe("Mô tả truyện"),
      mainCategoryId: z.string().describe("ID thể loại chính"),
      tagIds: z.string().describe("JSON array của tag IDs, ví dụ: '[1,2,3]'"),
      coverImageBase64: z
        .string()
        .optional()
        .describe(
          "Ảnh bìa dạng base64 (không bao gồm data:image/jpeg;base64,)"
        ),
    },
    async ({
      title,
      description,
      mainCategoryId,
      tagIds,
      coverImageBase64,
    }) => {
      try {
        const data = await chatStoryAITools.createStory(
          title,
          description,
          mainCategoryId,
          tagIds,
          coverImageBase64
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi tạo truyện: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );

  // Cập nhật truyện
  server.tool(
    "updateStory",
    "Cập nhật thông tin truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      title: z.string().describe("Tiêu đề mới"),
      description: z.string().describe("Mô tả mới"),
      mainCategoryId: z.string().describe("ID thể loại chính mới"),
      tagIds: z.string().describe("JSON array của tag IDs mới"),
      coverImageBase64: z
        .string()
        .optional()
        .describe("Ảnh bìa mới dạng base64"),
    },
    async ({
      storyId,
      title,
      description,
      mainCategoryId,
      tagIds,
      coverImageBase64,
    }) => {
      try {
        const data = await chatStoryAITools.updateStory(
          storyId,
          title,
          description,
          mainCategoryId,
          tagIds,
          coverImageBase64
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi cập nhật truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Xóa truyện
  server.tool(
    "deleteStory",
    "Xóa một truyện",
    {
      storyId: z.number().describe("ID của truyện cần xóa"),
    },
    async ({ storyId }) => {
      try {
        const data = await chatStoryAITools.deleteStory(storyId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi xóa truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Xuất bản truyện
  server.tool(
    "publishStory",
    "Xuất bản truyện (chuyển từ draft sang published)",
    {
      storyId: z.number().describe("ID của truyện cần xuất bản"),
    },
    async ({ storyId }) => {
      try {
        const data = await chatStoryAITools.publishStory(storyId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi xuất bản truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // ===== BOOKMARKS MANAGEMENT =====

  // Kiểm tra bookmark
  server.tool(
    "checkBookmark",
    "Kiểm tra trạng thái bookmark của truyện",
    {
      storyId: z.number().describe("ID của truyện"),
    },
    async ({ storyId }) => {
      try {
        const data = await chatStoryAITools.checkBookmark(storyId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi kiểm tra bookmark truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Toggle bookmark
  server.tool(
    "toggleBookmark",
    "Thêm hoặc xóa bookmark cho truyện",
    {
      storyId: z.number().describe("ID của truyện"),
    },
    async ({ storyId }) => {
      try {
        const data = await chatStoryAITools.toggleBookmark(storyId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi toggle bookmark truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // ===== CHAPTERS MANAGEMENT =====

  // Lấy danh sách chương
  server.tool(
    "getChapters",
    "Lấy danh sách chương của truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      status: z
        .string()
        .optional()
        .describe("Trạng thái chương: 'draft' hoặc 'published'"),
    },
    async ({ storyId, status }) => {
      try {
        const data = await chatStoryAITools.getChapters(storyId, status);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi lấy danh sách chương truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Lấy chi tiết chương
  server.tool(
    "getChapterDetail",
    "Lấy thông tin chi tiết của một chương",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương"),
    },
    async ({ storyId, chapterId }) => {
      try {
        const data = await chatStoryAITools.getChapterDetail(
          storyId,
          chapterId
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi lấy chi tiết chương ${chapterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Tạo chương mới
  server.tool(
    "createChapter",
    "Tạo chương mới cho truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      title: z.string().describe("Tiêu đề chương"),
      summary: z.string().describe("Tóm tắt nội dung chương"),
      status: z.enum(["draft", "published"]).describe("Trạng thái chương"),
    },
    async ({ storyId, title, summary, status }) => {
      try {
        const data = await chatStoryAITools.createChapter(storyId, {
          title,
          summary,
          status,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi tạo chương mới cho truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Cập nhật chương
  server.tool(
    "updateChapter",
    "Cập nhật thông tin chương",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương"),
      title: z.string().describe("Tiêu đề mới"),
      summary: z.string().describe("Tóm tắt mới"),
      status: z.enum(["draft", "published"]).describe("Trạng thái mới"),
    },
    async ({ storyId, chapterId, title, summary, status }) => {
      try {
        const data = await chatStoryAITools.updateChapter(storyId, chapterId, {
          title,
          summary,
          status,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi cập nhật chương ${chapterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Xóa chương
  server.tool(
    "deleteChapter",
    "Xóa chương khỏi truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương cần xóa"),
    },
    async ({ storyId, chapterId }) => {
      try {
        const data = await chatStoryAITools.deleteChapter(storyId, chapterId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi xóa chương ${chapterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // ===== CHARACTERS MANAGEMENT =====

  // Lấy danh sách nhân vật
  server.tool(
    "getCharacters",
    "Lấy danh sách nhân vật của truyện",
    {
      storyId: z.number().describe("ID của truyện"),
    },
    async ({ storyId }) => {
      try {
        const data = await chatStoryAITools.getCharacters(storyId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi lấy danh sách nhân vật truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Lấy chi tiết nhân vật
  server.tool(
    "getCharacterDetail",
    "Lấy thông tin chi tiết của một nhân vật",
    {
      storyId: z.number().describe("ID của truyện"),
      characterId: z.number().describe("ID của nhân vật"),
    },
    async ({ storyId, characterId }) => {
      try {
        const data = await chatStoryAITools.getCharacterDetail(
          storyId,
          characterId
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi lấy chi tiết nhân vật ${characterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );
}
