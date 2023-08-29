import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { FormFieldType } from "~/jsonTypes";

export const settingsRouter = router({
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
});
