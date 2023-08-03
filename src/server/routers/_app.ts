import { router, publicProcedure } from "~/server/trpc";
import { userRouter } from "./userRouter";
import { campaignRouter } from "./campaign";
import { characterRouter } from "./characterRouter";
import { exampleRouter } from "./example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),

  example: exampleRouter,

  user: userRouter,
  campaign: campaignRouter,
  character: characterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
