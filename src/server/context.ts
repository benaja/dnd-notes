import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import ws from "ws";
import { getServerAuthSession } from "~/pages/api/auth/[...nextauth]";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts:
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
    | trpcNext.CreateNextContextOptions
) => {
  console.log("createContext", opts);
  return {
    session: await getSession(),
  };
  // const session = await getServerAuthSession({
  //   req: opts.req,
  //   res: opts.res,
  // });
  console.log("createContext for", session?.user?.name ?? "unknown user");
  return {
    session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
