import { z } from "zod";
import { characterSchema } from "~/components/campaign/shema";
import { router, protectedProcedure } from "~/server/trpc";
import { prisma } from "../prisma";

export const characterRouter = router({
  create: protectedProcedure
    .input(characterSchema)
    .mutation(async ({ input, ctx }) => {
      const character = await prisma.character.create({
        data: {
          ...input,
        },
      });

      return character;
    }),
});
