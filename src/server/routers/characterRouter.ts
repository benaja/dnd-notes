import { z } from "zod";
import { characterSchema } from "~/components/campaign/shema";
import { router, protectedProcedure } from "~/server/trpc";
import { prisma } from "../prisma";
import { settingsRouter } from "./settingsRouter";
import { Context } from "../context";

const schema = characterSchema.omit({ id: true });

export type CharacterFormValues = z.infer<typeof schema>;

async function characterData(input: CharacterFormValues, ctx: Context) {
  const caller = settingsRouter.createCaller(ctx);
  const characterFields = await caller.characterFields();
  const data = {
    ...input,
    fields: characterFields.map((field) => ({
      name: field.name,
      value: input.fields[field.name] || "",
      type: field.type,
      label: field.label,
      width: field.width,
    })),
  };

  return data;
}

export const characterRouter = router({
  create: protectedProcedure
    .input(characterSchema.omit({ id: true }))
    .mutation(async ({ input, ctx }) => {
      const data = await characterData(input, ctx);
      const character = await prisma.character.create({
        data,
      });

      return character;
    }),

  search: protectedProcedure
    .input(z.string().optional().nullable())
    .query(async ({ input, ctx }) => {
      if (!input) return [];
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

  update: protectedProcedure
    .input(characterSchema)
    .mutation(async ({ input, ctx }) => {
      const data = await characterData(input, ctx);
      const character = await prisma.character.update({
        where: {
          id: input.id,
        },
        data,
      });

      return character;
    }),
});
