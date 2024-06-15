import NextAuth, { DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: UserRole
  }
}


import { getUserById } from '@/data/user'

import { db } from '@/lib/db'
import authConfig from '@/auth.config'

import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    }

  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;
      const existingUser = await getUserById(user.id!);
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      //2FA check
      if (existingUser.isTowFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) return false;
        // Delete two factor Confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        })
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.userId = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token
      token.role = existingUser.role

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
})
