/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData) {
    const { username, email, password } = data;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Check if email exists
      const [existingUsers] = await pool.execute(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        throw new Error('Email đã được sử dụng');
      }

      // Insert new user
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, user_password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      return {
        message: 'Đăng ký thành công',
        userId: (result as any).insertId
      };
    } catch (error: any) {
      if (error.message === 'Email đã được sử dụng') {
        throw error;
      }
      throw new Error('Đã xảy ra lỗi khi đăng ký');
    }
  }

  static async login(email: string, password: string) {
    try {
      // Get user by email
      const [users] = await pool.execute(
        'SELECT user_id, username, email, user_password, avatar FROM users WHERE email = ?',
        [email]
      );

      const user = (users as any[])[0];

      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.user_password);

      if (!isValidPassword) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // Return user data (excluding password)
      const { user_password, ...userData } = user;
      return {
        message: 'Đăng nhập thành công',
        user: userData
      };
    } catch (error: any) {
      throw error;
    }
  }
} 