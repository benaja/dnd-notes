import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";

export const contentRouter = router({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const content = await prisma.content.update({
        where: {
          id: input.id,
        },
        data: {
          value: input.value,
        },
      });

      return content;
    }),
});
