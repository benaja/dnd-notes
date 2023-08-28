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

  search: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const characters = await prisma.character.findMany({
      where: {
        name: {
          contains: input,
        },
      },
    });

    return characters;
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const character = await prisma.character.findUnique({
        where: {
          id: input,
        },
      });

      return character;
    }),

  getByIds: protectedProcedure
    .input(z.array(z.string()))
    .query(async ({ input, ctx }) => {
      const characters = await prisma.character.findMany({
        where: {
          id: {
            in: input,
          },
        },
      });

      return characters;
    }),
});
