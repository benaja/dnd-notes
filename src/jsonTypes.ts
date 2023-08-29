export {};

export enum FormFieldType {
  string = "string",
  number = "number",
  boolean = "boolean",
  date = "date",
  richText = "richText",
  select = "select",
}

export enum CharacterType {
  Player = "player",
  NPC = "npc",
}

declare global {
  export namespace PrismaJson {
    type FormField = {
      type: FormFieldType;
      label: string;
      name: string;
      width: number;
      options?: string[];
      required?: boolean;
      value: any;
    };

    type Fields = Array<FormField>;

    type CharacterTypeField = CharacterType;
  }
}
