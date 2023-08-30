export {};

export enum FormFieldType {
  string = "string",
  number = "number",
  boolean = "boolean",
  date = "date",
  richText = "richText",
  select = "select",
  avatar = "avatar",
}

export enum CharacterType {
  Player = "player",
  NPC = "npc",
}

export enum QuestStatus {
  open = "open",
  inProgress = "inProgress",
  completed = "completed",
  onHold = "onHold",
}

export enum PageType {
  Player = "player",
  NPC = "npc",
  Quest = "quest",
  Session = "session",
  Page = "page",
  Item = "item",
}

declare global {
  export namespace PrismaJson {
    type FormField = {
      type: FormFieldType;
      showOnCreate?: boolean;
      showOnPreview?: boolean;
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
