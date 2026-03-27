import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "YOUR_GOOGLE_ID",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "YOUR_GOOGLE_SECRET",
    }),
  ],
  secret: process.env.AUTH_SECRET || "fallback-secret-for-development-only-12345",
  trustHost: true,
  debug: true,
  session: {
    strategy: "jwt",
  },
  logger: {
    error(error) {
      console.error("🔴 NEXTAUTH CRITICAL ERROR:", error);
      if (error instanceof Error && error.cause) {
        console.error("💥 EXACT DB CAUSE:", JSON.stringify(error.cause, null, 2));
      } else if (error && (error as any).cause) {
        console.error("💥 EXACT DB CAUSE (raw):", (error as any).cause);
      }
    },
    warn(code) {
      console.warn("🟠 NEXTAUTH WARNING:", code);
    },
    debug(code, metadata) {
      console.log("🔵 NEXTAUTH DEBUG:", code, metadata);
    },
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
