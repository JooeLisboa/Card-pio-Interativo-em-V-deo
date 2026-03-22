import type { NextAuthConfig } from "next-auth";

type SharedAuthConfig = Omit<NextAuthConfig, "providers">;

export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.restaurantId = user.restaurantId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as string | undefined;
        session.user.restaurantId = token.restaurantId as string | undefined;
      }

      return session;
    }
  }
} satisfies SharedAuthConfig;
