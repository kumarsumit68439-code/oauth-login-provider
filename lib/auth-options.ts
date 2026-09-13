import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { usersByEmail, users } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export const authOptions: NextAuthOptions = {
  providers: [
    // ===== Own Email/Password Login =====
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const user = usersByEmail.get(email);

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),

    // ===== Google =====
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // ===== GitHub =====
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Auto-create user in our store when they login via Google/GitHub
      if (account?.provider === "google" || account?.provider === "github") {
        const email = (user.email || "").toLowerCase();
        if (email && !usersByEmail.has(email)) {
          const newUser = {
            id: uuidv4(),
            email,
            name: user.name || email.split("@")[0],
            passwordHash: "", // social login – no password
            createdAt: new Date().toISOString(),
            provider: account.provider,
          };
          users.set(newUser.id, newUser);
          usersByEmail.set(email, newUser);
          user.id = newUser.id;
        } else if (email) {
          const existing = usersByEmail.get(email);
          if (existing) user.id = existing.id;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider || "credentials";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || "nextauth-secret-change-me",
};
