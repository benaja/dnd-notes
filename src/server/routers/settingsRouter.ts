import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const settingsRouter = router({
  characterFields: protectedProcedure.query(async ({ ctx }) => {
    const fields: PrismaJson.FormField[] = [
      {
        type: "number",
        label: "Age",
        name: "age",
        width: 0.5,
      },
      {
        type: "select",
        label: "Gender",
        name: "gender",
        width: 0.5,
        options: ["Male", "Female", "Unknown"],
      },
      {
        type: "richText",
        label: "Description",
        name: "description",
        width: 1,
      },
    ];

    return fields;
  }),
});
