/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import pool from "@/lib/db"
import { GoogleDriveService } from "@/services/google-drive.service"

// PUT - Cập nhật nhân vật
export async function PUT(
  request: Request,
  context: { params: { id: string, characterId: string } }
) {
  const { id: storyId, characterId } = await context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const avatarImage = formData.get('avatarImage') as File | null
    const role = formData.get('role') as 'main' | 'supporting'

    // Kiểm tra nếu đổi thành nhân vật chính
    if (role === 'main') {
      const [existingMain] = await pool.execute(
        `SELECT character_id FROM story_characters 
         WHERE story_id = ? AND role = 'main' AND character_id != ?`,
        [storyId, characterId]
      ) as any[]

      if (existingMain.length > 0) {
        return NextResponse.json(
          { error: "Truyện đã có nhân vật chính" },
          { status: 400 }
        )
      }
    }

    // Lấy thông tin nhân vật cũ
    const [characters] = await pool.execute(
      'SELECT avatar_file_id FROM story_characters WHERE character_id = ?',
      [characterId]
    ) as any[]

    if (!characters.length) {
      return NextResponse.json(
        { error: "Không tìm thấy nhân vật" },
        { status: 404 }
      )
    }

    let avatarUrl = null
    let fileId = characters[0].avatar_file_id

    if (avatarImage instanceof File && avatarImage.size > 0) {
      // Upload ảnh mới
      const buffer = Buffer.from(await avatarImage.arrayBuffer())
      const { directLink, fileId: newFileId } = await GoogleDriveService.uploadFile(
        buffer,
        avatarImage.type,
        parseInt(storyId),
        'character-avatar',
        parseInt(characterId)
      )
      avatarUrl = directLink
      fileId = newFileId

      // Xóa ảnh cũ nếu tồn tại
      if (characters[0].avatar_file_id) {
        try {
          await GoogleDriveService.deleteFile(characters[0].avatar_file_id)
        } catch (error) {
          console.error("Lỗi khi xóa ảnh cũ:", error)
          // Tiếp tục xử lý ngay cả khi không xóa được ảnh cũ
        }
      }
    }

    await pool.execute(
      `UPDATE story_characters 
       SET name = ?, description = ?, role = ?
       ${avatarUrl ? ', avatar_image = ?, avatar_file_id = ?' : ''}
       WHERE character_id = ?`,
      avatarUrl 
        ? [name, description, role, avatarUrl, fileId, characterId]
        : [name, description, role, characterId]
    )

    return NextResponse.json({ message: "Cập nhật nhân vật thành công" })
  } catch (error) {
    console.error("Lỗi khi cập nhật nhân vật:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

// DELETE - Xóa nhân vật
export async function DELETE(
  request: Request,
  context: { params: { id: string, characterId: string } }
) {
  const { id: characterId } = await context.params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 401 }
      )
    }

    // Lấy thông tin nhân vật để xóa ảnh
    const [characters] = await pool.execute(
      'SELECT avatar_file_id FROM story_characters WHERE character_id = ?',
      [characterId]
    ) as any[]

    if (characters.length && characters[0].avatar_file_id) {
      await GoogleDriveService.deleteFile(characters[0].avatar_file_id)
    }

    await pool.execute(
      'DELETE FROM story_characters WHERE character_id = ?',
      [characterId]
    )

    return NextResponse.json({ message: "Xóa nhân vật thành công" })
  } catch (error) {
    console.error("Lỗi khi xóa nhân vật:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra" },
      { status: 500 }
    )
  }
} 