import { Character } from "@prisma/client";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { FormFieldType, PageType } from "~/jsonTypes";

export const settingsRouter = router({
  fields: protectedProcedure
    .input(z.nativeEnum(PageType))
    .query(async ({ input, ctx }) => {
      let fields: PrismaJson.FormField[] = [];

      switch (input) {
        case PageType.Player:
        case PageType.NPC:
          fields = [
            {
              type: FormFieldType.avatar,
              label: "Avatar",
              name: "avatar",
              width: 1,
              value: null,
              showOnCreate: true,
              showOnPreview: true,
            },
            {
              type: FormFieldType.number,
              label: "Age",
              name: "age",
              width: 0.5,
              value: null,
            },
            {
              type: FormFieldType.select,
              label: "Gender",
              name: "gender",
              width: 0.5,
              options: ["Male", "Female", "Unknown"],
              value: null,
            },
            {
              type: FormFieldType.richText,
              label: "Description",
              name: "description",
              width: 1,
              value: null,
            },
          ];
          break;
      }

      return fields;
    }),
  characterFields: protectedProcedure.query(async ({ ctx }) => {
    const fields: PrismaJson.FormField[] = [
      {
        type: FormFieldType.number,
        label: "Age",
        name: "age",
        width: 0.5,
        value: null,
      },
      {
        type: FormFieldType.select,
        label: "Gender",
        name: "gender",
        width: 0.5,
        options: ["Male", "Female", "Unknown"],
        value: null,
      },
      {
        type: FormFieldType.richText,
        label: "Description",
        name: "description",
        width: 1,
        value: null,
      },
    ];

    return fields;
  }),

  questFields: protectedProcedure.query(async ({ ctx }) => {
    const fields: PrismaJson.FormField[] = [
      {
        type: FormFieldType.richText,
        label: "Description",
        name: "description",
        width: 1,
        value: null,
      },
    ];

    return fields;
  }),
});
