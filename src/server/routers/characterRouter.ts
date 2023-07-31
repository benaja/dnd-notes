import { z } from "zod";
import { characterSchema } from "~/app/(app)/dashboard/shema";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";

export const characterRouter = createTRPCRouter({
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
