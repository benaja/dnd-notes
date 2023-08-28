export {};

declare global {
  namespace PrismaJson {
    type Field = {
      id: string;
      label: string;
      type: "string" | "number" | "boolean" | "date" | "richText";
      value: any;
    };

    type Fields = Array<Field>;
  }
}
