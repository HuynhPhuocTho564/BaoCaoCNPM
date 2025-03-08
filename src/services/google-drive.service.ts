/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from 'googleapis';
import { Readable } from 'stream';

export class GoogleDriveService {
  private static driveClient = google.drive({
    version: 'v3',
    auth: new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    }),
  });

  private static bufferToStream(buffer: Buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  static async uploadFile(file: Buffer, mimeType: string, userId: number) {
    try {
      const extension = mimeType === 'image/jpeg' ? '.jpg' : 
                       mimeType === 'image/png' ? '.png' : '.gif';
      const fileName = `avatar_${userId}${extension}`;

      // Kiểm tra file tồn tại
      const existingFiles = await this.driveClient.files.list({
        q: `name = '${fileName}' and '${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
      });

      let fileId: string;

      if (existingFiles.data.files && existingFiles.data.files.length > 0) {
        const existingFile = existingFiles.data.files[0];
        fileId = existingFile.id!;

        if (existingFile.mimeType !== mimeType) {
          await this.deleteFile(fileId);
          const newFile = await this.createFile(file, mimeType, fileName);
          fileId = newFile.id!;
        } else {
          await this.driveClient.files.update({
            fileId: fileId,
            media: {
              mimeType: mimeType,
              body: this.bufferToStream(file),
            },
          });
        }
      } else {
        const newFile = await this.createFile(file, mimeType, fileName);
        fileId = newFile.id!;
      }

      await this.driveClient.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Tạo link preview thủ công:
      const directLink = `https://drive.google.com/uc?id=${fileId}`;

      return {
        fileId,
        directLink,
      };
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw new Error('Lỗi khi tải file lên Google Drive');
    }
  }

  private static async createFile(file: Buffer, mimeType: string, fileName: string) {
    const response = await this.driveClient.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
      },
      media: {
        mimeType: mimeType,
        body: this.bufferToStream(file),
      },
      fields: 'id',
    });

    return response.data;
  }

  static async deleteFile(fileId: string) {
    try {
      await this.driveClient.files.delete({
        fileId: fileId,
      });
    } catch (error: any) {
      // Kiểm tra nếu lỗi là 404 Not Found
      if (error.code === 404) {
        console.warn(`File not found on Google Drive: ${fileId}`);
        // Bỏ qua lỗi, không throw exception
        return;
      }
      console.error('Error deleting from Google Drive:', error);
      throw new Error('Lỗi khi xóa file từ Google Drive');
    }
  }
} 