import trpcNext from "@trpc/server/adapters/next";
import trpc from "@trpc/server";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import { IncomingMessage } from "http";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import ws from "ws";
import { authOptions } from "./authOptions";
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts:
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
    | trpcNext.CreateNextContextOptions,
  type: "http" | "websocket" = "http",
) => {
  let session = null;
  if (type === "http") {
    session = await getServerSession(opts.req, opts.res, authOptions);
  } else {
    session = await getSession({ req: opts.req });
  }
  return {
    session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
