import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/routers/_app";
import { createTRPCContext } from "~/server/trpc";
import prisma from "~/server/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// export API handler
const handler = async (req: Request) =>
  fetchRequestHandler({
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: async (opts) => {
      return {
        session: await getServerSession(authOptions),
        prisma,
      };
    },
    req: req,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
