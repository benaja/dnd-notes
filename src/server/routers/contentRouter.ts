import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";

export const contentRouter = router({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.string().optional(),
        characters: z.array(z.object({ id: z.string() })).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const content = await prisma.content.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          characters: input.characters && {
            set: input.characters,
          },
        },
      });

      return content;
    }),
});
