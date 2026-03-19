import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"
import Twitter from "next-auth/providers/twitter"
import Apple from "next-auth/providers/apple"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "YOUR_GOOGLE_ID",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "YOUR_GOOGLE_SECRET",
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID || "YOUR_GITHUB_ID",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "YOUR_GITHUB_SECRET",
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID || "YOUR_DISCORD_ID",
      clientSecret: process.env.AUTH_DISCORD_SECRET || "YOUR_DISCORD_SECRET",
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID || "YOUR_TWITTER_ID",
      clientSecret: process.env.AUTH_TWITTER_SECRET || "YOUR_TWITTER_SECRET",
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID || "YOUR_APPLE_ID",
      clientSecret: process.env.AUTH_APPLE_SECRET || "YOUR_APPLE_SECRET",
    }),
  ],
  secret: process.env.AUTH_SECRET || "fallback-secret-for-development-only-12345",
  trustHost: true,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  pages: {
    signIn: '/auth/signin',
  },
})
