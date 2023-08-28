import { protectedProcedure, router } from "../trpc";

export type FormField = {
  type: "string" | "number" | "boolean" | "date" | "richText" | "select";
  label: string;
  name: string;
  width: number;
  options?: string[];
};

export const settingsRouter = router({
  characterFields: protectedProcedure.query(async ({ ctx }) => {
    const fields: FormField[] = [
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
