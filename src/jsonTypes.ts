import { PreviewField } from "./jsonTypes";
export {};

export enum FormFieldType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Date = "date",
  RichText = "richText",
  Select = "select",
  Avatar = "avatar",
}

export enum QuestStatus {
  Open = "open",
  InProgress = "inProgress",
  Completed = "completed",
  OnHold = "onHold",
}

export enum PageType {
  Player = "player",
  NPC = "npc",
  Quest = "quest",
  Session = "session",
  Page = "page",
  Item = "item",
}

export type FormField = {
  type: FormFieldType;
  showOnCreate?: boolean;
  showOnPreview?: boolean;
  label: string;
  width: number;
  options?: string[] | Array<{ label: string; value: string }>;
  required?: boolean;
  value: any;
  position?: number;
};

export type PreviewField = {
  type: FormFieldType;
  name: string;
  label: string;
  value: any;
};

export enum MentionType {
  Text = "text",
}

export type Fields = Record<string, FormField>;

export type PreviewFields = Record<string, PreviewField>;

declare global {
  export namespace PrismaJson {
    type FieldsField = Fields;

    type PreviewFieldsField = PreviewFields;

    type PageTypeField = PageType;

    type MentionTypeField = MentionType;
  }
}
