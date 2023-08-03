import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import { GetServerSidePropsContext } from "next";
import { prisma } from "~/server/prisma";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { authOptions } from "~/server/authOptions";

export default NextAuth({
  // adapter cant be in authOptions otherwise the websocket trpc client will fail
  adapter: PrismaAdapter(prisma),
  ...authOptions,
});

// export { handler as GET, handler as POST };

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
