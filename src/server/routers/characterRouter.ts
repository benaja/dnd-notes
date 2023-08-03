import { z } from "zod";
import { characterSchema } from "~/app1/(app)/dashboard/shema";
import { router, protectedProcedure } from "~/server/trpc";

export const characterRouter = router({
  create: protectedProcedure
    .input(characterSchema)
    .mutation(async ({ input, ctx }) => {
      const character = await ctx.prisma.character.create({
        data: {
          ...input,
        },
      });

      return character;
    }),
});
