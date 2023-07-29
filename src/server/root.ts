import { campaignRouter } from "./routers/campaign";
import { exampleRouter } from "~/server/routers/example";
import { createTRPCRouter } from "~/server/trpc";
import { userRouter } from "./routers/userRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  campaign: campaignRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
