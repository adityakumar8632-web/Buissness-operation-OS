import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            organization: true,
            role: { include: { permissions: { include: { permission: true } } } },
          },
        });
        if (!user) return null;

        const validPassword = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!validPassword) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          organizationId: user.organizationId,
          organizationName: user.organization.name,
          roleName: user.role.name,
          permissions: user.role.permissions.map((rp) => rp.permission.key),
        };
      },
    }),
  ],
  callbacks: {
    // Runs on sign-in and on every session read. We stash the org/role/
    // permission data on the token here so every request downstream can
    // check access without hitting the database again.
    async jwt({ token, user }) {
      if (user) {
        token.organizationId = user.organizationId;
        token.organizationName = user.organizationName;
        token.roleName = user.roleName;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.organizationId = token.organizationId as string;
        session.user.organizationName = token.organizationName as string;
        session.user.roleName = token.roleName as string;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
};
