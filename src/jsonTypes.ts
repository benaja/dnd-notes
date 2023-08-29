export {};

export type FormFieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "richText"
  | "select";

declare global {
  namespace PrismaJson {
    type FormField = {
      type: FormFieldType;
      label: string;
      name: string;
      width: number;
      options?: string[];
      required?: boolean;
    };

    type Fields = Array<FormField>;
  }
}
