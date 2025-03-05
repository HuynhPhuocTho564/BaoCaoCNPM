/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from "next-auth/providers/google";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthService } from "@/services/auth.service";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { type: "boolean" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Vui lòng nhập email và mật khẩu');
          }

          const result = await AuthService.login(
            credentials.email,
            credentials.password
          );

          return {
            id: result.user.user_id.toString(),
            email: result.user.email,
            name: result.user.username,
            avatar: result.user.avatar,
            remember: credentials.remember === "true"
          };
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  pages: {
    signIn: '/', // Trang đăng nhập custom
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.avatar = user.avatar || user.image;
        token.name = user.name;
        if (!user.remember) {
          token.maxAge = 0;
        } else {
          token.maxAge = 30 * 24 * 60 * 60;
        }
      }

      if (trigger === "update") {
        if (session?.name) token.name = session.name;
        if (session?.avatar) token.avatar = session.avatar;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.avatar = token.avatar as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await AuthService.register({
            username: user.name || '',
            email: user.email || '',
            password: '', // Google login không cần password
            isGoogleUser: true,
            avatar: user.image || ''
          });
          return true;
        } catch (error: any) {
          if (error.message === 'Email đã được sử dụng') {
            return true; // Cho phép đăng nhập nếu email đã tồn tại
          }
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      return true;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 