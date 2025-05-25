/**
 * Module đăng ký công cụ MCP mở rộng cho ChatStoryAI
 * (Phần 2: Characters, Dialogues, Outlines, Account)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as chatStoryAITools from "../tools/chatstoryai.js";

/**
 * Đăng ký các công cụ MCP mở rộng cho ChatStoryAI
 * @param server Server MCP
 */
export function registerChatStoryAIExtendedTools(server: McpServer) {
  // ===== CHARACTERS MANAGEMENT (CONTINUED) =====

  // Tạo nhân vật mới
  server.tool(
    "createCharacter",
    "Tạo nhân vật mới cho truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      name: z.string().describe("Tên nhân vật"),
      description: z.string().describe("Mô tả nhân vật"),
      role: z.enum(["main", "supporting"]).describe("Vai trò nhân vật"),
      gender: z.string().optional().describe("Giới tính"),
      birthday: z.string().optional().describe("Ngày sinh (YYYY-MM-DD)"),
      height: z.number().optional().describe("Chiều cao (cm)"),
      weight: z.number().optional().describe("Cân nặng (kg)"),
      personality: z.string().optional().describe("Tính cách"),
      appearance: z.string().optional().describe("Ngoại hình"),
      background: z.string().optional().describe("Lý lịch"),
      avatarImageBase64: z
        .string()
        .optional()
        .describe("Ảnh đại diện dạng base64"),
    },
    async ({
      storyId,
      name,
      description,
      role,
      gender,
      birthday,
      height,
      weight,
      personality,
      appearance,
      background,
      avatarImageBase64,
    }) => {
      try {
        const characterData = {
          name,
          description,
          role,
          gender,
          birthday,
          height,
          weight,
          personality,
          appearance,
          background,
        };
        const data = await chatStoryAITools.createCharacter(
          storyId,
          characterData,
          avatarImageBase64
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
              text: `Lỗi khi tạo nhân vật cho truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Cập nhật nhân vật
  server.tool(
    "updateCharacter",
    "Cập nhật thông tin nhân vật",
    {
      storyId: z.number().describe("ID của truyện"),
      characterId: z.number().describe("ID của nhân vật"),
      name: z.string().describe("Tên nhân vật mới"),
      description: z.string().describe("Mô tả mới"),
      role: z.enum(["main", "supporting"]).describe("Vai trò mới"),
      gender: z.string().optional().describe("Giới tính mới"),
      birthday: z.string().optional().describe("Ngày sinh mới"),
      height: z.number().optional().describe("Chiều cao mới"),
      weight: z.number().optional().describe("Cân nặng mới"),
      personality: z.string().optional().describe("Tính cách mới"),
      appearance: z.string().optional().describe("Ngoại hình mới"),
      background: z.string().optional().describe("Lý lịch mới"),
      avatarImageBase64: z.string().optional().describe("Ảnh đại diện mới"),
    },
    async ({
      storyId,
      characterId,
      name,
      description,
      role,
      gender,
      birthday,
      height,
      weight,
      personality,
      appearance,
      background,
      avatarImageBase64,
    }) => {
      try {
        const characterData = {
          name,
          description,
          role,
          gender,
          birthday,
          height,
          weight,
          personality,
          appearance,
          background,
        };
        const data = await chatStoryAITools.updateCharacter(
          storyId,
          characterId,
          characterData,
          avatarImageBase64
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
              text: `Lỗi khi cập nhật nhân vật ${characterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Xóa nhân vật
  server.tool(
    "deleteCharacter",
    "Xóa nhân vật khỏi truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      characterId: z.number().describe("ID của nhân vật cần xóa"),
    },
    async ({ storyId, characterId }) => {
      try {
        const data = await chatStoryAITools.deleteCharacter(
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
              text: `Lỗi khi xóa nhân vật ${characterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // ===== DIALOGUES MANAGEMENT =====

  // Lấy danh sách hội thoại
  server.tool(
    "getDialogues",
    "Lấy danh sách hội thoại trong chương",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương"),
    },
    async ({ storyId, chapterId }) => {
      try {
        // Lấy danh sách hội thoại
        const dialoguesData = await chatStoryAITools.getDialogues(
          storyId,
          chapterId
        );

        // Lấy danh sách nhân vật để join tên
        const charactersData = await chatStoryAITools.getCharacters(storyId);

        // Tạo map character_id -> character_name để join nhanh
        const characterMap = new Map();
        charactersData.characters.forEach((char) => {
          characterMap.set(char.character_id, char.name);
        });

        // Join dữ liệu để thêm tên nhân vật
        const dialoguesWithCharacterNames = dialoguesData.dialogues.map(
          (dialogue) => ({
            ...dialogue,
            character_name: dialogue.character_id
              ? characterMap.get(dialogue.character_id)
              : null,
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  ...dialoguesData,
                  dialogues: dialoguesWithCharacterNames,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: unknown) {
        return {
          content: [
            {
              type: "text",
              text: `Lỗi khi lấy danh sách hội thoại chương ${chapterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Tạo hội thoại mới
  server.tool(
    "createDialogue",
    "Tạo hội thoại mới trong chương",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương"),
      characterId: z
        .number()
        .optional()
        .describe("ID của nhân vật (nếu là dialogue)"),
      content: z.string().describe("Nội dung hội thoại"),
      orderNumber: z.number().optional().describe("Thứ tự trong chương"),
      type: z
        .enum(["dialogue", "narration"])
        .optional()
        .describe("Loại hội thoại"),
    },
    async ({ storyId, chapterId, characterId, content, orderNumber, type }) => {
      try {
        // Validation giống frontend
        const finalType = type || "narration";

        // Nếu type là narration thì character_id phải là null
        // Nếu type là dialogue thì phải có character_id
        if (finalType === "dialogue" && !characterId) {
          throw new Error("Loại dialogue phải có character_id");
        }

        // Nếu orderNumber không được cung cấp, tự động tính toán
        let finalOrderNumber = orderNumber;
        if (finalOrderNumber === undefined) {
          try {
            // Lấy danh sách dialogue hiện tại để tính order_number
            const existingDialogues = await chatStoryAITools.getDialogues(
              storyId,
              chapterId
            );
            finalOrderNumber = existingDialogues.dialogues.length + 1;
          } catch (error) {
            // Nếu không lấy được danh sách, mặc định là 1
            finalOrderNumber = 1;
          }
        }

        const dialogueData = {
          character_id: finalType === "narration" ? null : characterId,
          content,
          order_number: finalOrderNumber,
          type: finalType,
        };

        const data = await chatStoryAITools.createDialogue(
          storyId,
          chapterId,
          dialogueData
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
              text: `Lỗi khi tạo hội thoại mới cho chương ${chapterId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Cập nhật hội thoại
  server.tool(
    "updateDialogue",
    "Cập nhật nội dung hội thoại",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương"),
      dialogueId: z.number().describe("ID của hội thoại"),
      content: z.string().describe("Nội dung mới"),
    },
    async ({ storyId, chapterId, dialogueId, content }) => {
      try {
        const data = await chatStoryAITools.updateDialogue(
          storyId,
          chapterId,
          dialogueId,
          content
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
              text: `Lỗi khi cập nhật hội thoại ${dialogueId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Xóa hội thoại
  server.tool(
    "deleteDialogue",
    "Xóa hội thoại khỏi chương",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương"),
      dialogueId: z.number().describe("ID của hội thoại cần xóa"),
    },
    async ({ storyId, chapterId, dialogueId }) => {
      try {
        const data = await chatStoryAITools.deleteDialogue(
          storyId,
          chapterId,
          dialogueId
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
              text: `Lỗi khi xóa hội thoại ${dialogueId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Di chuyển hội thoại
  server.tool(
    "moveDialogue",
    "Thay đổi thứ tự hội thoại trong chương",
    {
      storyId: z.number().describe("ID của truyện"),
      chapterId: z.number().describe("ID của chương"),
      dialogueId: z.number().describe("ID của hội thoại"),
      newOrder: z.number().describe("Thứ tự mới"),
    },
    async ({ storyId, chapterId, dialogueId, newOrder }) => {
      try {
        const data = await chatStoryAITools.moveDialogue(
          storyId,
          chapterId,
          dialogueId,
          newOrder
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
              text: `Lỗi khi di chuyển hội thoại ${dialogueId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // ===== OUTLINES MANAGEMENT =====

  // Lấy danh sách đại cương
  server.tool(
    "getOutlines",
    "Lấy danh sách đại cương của truyện",
    {
      storyId: z.number().describe("ID của truyện"),
    },
    async ({ storyId }) => {
      try {
        const data = await chatStoryAITools.getOutlines(storyId);
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
              text: `Lỗi khi lấy danh sách đại cương truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Lấy chi tiết đại cương
  server.tool(
    "getOutlineDetail",
    "Lấy thông tin chi tiết của một đại cương",
    {
      storyId: z.number().describe("ID của truyện"),
      outlineId: z.number().describe("ID của đại cương"),
    },
    async ({ storyId, outlineId }) => {
      try {
        const data = await chatStoryAITools.getOutlineDetail(
          storyId,
          outlineId
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
              text: `Lỗi khi lấy chi tiết đại cương ${outlineId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Tạo đại cương mới
  server.tool(
    "createOutline",
    "Tạo đại cương mới cho truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      title: z.string().describe("Tiêu đề đại cương"),
      description: z.string().describe("Mô tả chi tiết"),
    },
    async ({ storyId, title, description }) => {
      try {
        const data = await chatStoryAITools.createOutline(storyId, {
          title,
          description,
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
              text: `Lỗi khi tạo đại cương mới cho truyện ${storyId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Cập nhật đại cương
  server.tool(
    "updateOutline",
    "Cập nhật thông tin đại cương",
    {
      storyId: z.number().describe("ID của truyện"),
      outlineId: z.number().describe("ID của đại cương"),
      title: z.string().describe("Tiêu đề mới"),
      description: z.string().describe("Mô tả mới"),
    },
    async ({ storyId, outlineId, title, description }) => {
      try {
        const data = await chatStoryAITools.updateOutline(storyId, outlineId, {
          title,
          description,
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
              text: `Lỗi khi cập nhật đại cương ${outlineId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Xóa đại cương
  server.tool(
    "deleteOutline",
    "Xóa đại cương khỏi truyện",
    {
      storyId: z.number().describe("ID của truyện"),
      outlineId: z.number().describe("ID của đại cương cần xóa"),
    },
    async ({ storyId, outlineId }) => {
      try {
        const data = await chatStoryAITools.deleteOutline(storyId, outlineId);
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
              text: `Lỗi khi xóa đại cương ${outlineId}: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // ===== ACCOUNT MANAGEMENT =====

  // Lấy danh sách bookmark
  server.tool(
    "getBookmarks",
    "Lấy danh sách tất cả truyện đã bookmark",
    {},
    async () => {
      try {
        const data = await chatStoryAITools.getBookmarks();
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
              text: `Lỗi khi lấy danh sách bookmark: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Lấy lịch sử xem
  server.tool(
    "getViewHistory",
    "Lấy lịch sử 20 truyện gần đây nhất đã xem",
    {},
    async () => {
      try {
        const data = await chatStoryAITools.getViewHistory();
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
              text: `Lỗi khi lấy lịch sử xem: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );

  // ===== CATEGORIES AND TAGS MANAGEMENT =====

  // Lấy danh sách thể loại và tag
  server.tool(
    "getCategoriesAndTags",
    "Lấy danh sách tất cả thể loại và tag",
    {},
    async () => {
      try {
        const data = await chatStoryAITools.getCategoriesAndTags();
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
              text: `Lỗi khi lấy danh sách thể loại và tag: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Lấy danh sách thể loại
  server.tool(
    "getCategories",
    "Lấy danh sách tất cả thể loại truyện",
    {},
    async () => {
      try {
        const data = await chatStoryAITools.getCategories();
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
              text: `Lỗi khi lấy danh sách thể loại: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    }
  );

  // Lấy danh sách tag
  server.tool("getTags", "Lấy danh sách tất cả tag", {}, async () => {
    try {
      const data = await chatStoryAITools.getTags();
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
            text: `Lỗi khi lấy danh sách tag: ${(error as Error).message}`,
          },
        ],
      };
    }
  });
}
