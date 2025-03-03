/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthService } from "@/services/auth.service";

export const authOptions: AuthOptions = {
  providers: [
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
        token.avatar = user.avatar;
        token.name = user.name;
        if (!user.remember) {
          token.maxAge = 0;
        } else {
          token.maxAge = 30 * 24 * 60 * 60;
        }
      }

      // Xử lý khi có update session
      if (trigger === "update" && session?.name) {
        token.name = session.name;
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
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 