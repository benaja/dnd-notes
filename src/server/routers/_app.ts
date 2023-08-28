import { router, publicProcedure } from "~/server/trpc";
import { userRouter } from "./userRouter";
import { campaignRouter } from "./campaignRouter";
import { characterRouter } from "./characterRouter";
import { exampleRouter } from "./example";
import { contentRouter } from "./contentRouter";
import { sessionRouter } from "./sessionRouter";
import { settingsRouter } from "./settingsRouter";

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
  content: contentRouter,
  session: sessionRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
