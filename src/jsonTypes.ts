import { ComboboxItem } from "./components/ui/Combobox";

export {};

export enum FormFieldType {
  Text = "text",
  Date = "date",
  RichText = "richText",
  Select = "select",
  Avatar = "avatar",
  Image = "image",
  PageSelector = "pageSelector",
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
  CampaignLandingPage = "campaignLandingPage",
  Location = "location",
}

export interface IFormField {
  type: FormFieldType;
  name: string;
  showOnCreate?: boolean;
  showOnPreview?: boolean;
  label: string;
  width: number;
  required?: boolean;
  className?: string;
}

export interface ITextField extends IFormField {
  type: FormFieldType.Text;
  value: string | number | null;
  options: {
    type: "text" | "number";
  };
}
export interface ISelectField extends IFormField {
  type: FormFieldType.Select;
  value: string | string[] | null;
  options: {
    items: string[] | Array<{ label: string; value: string }>;
    multiple?: boolean;
  };
}

export interface IRichTextField extends IFormField {
  type: FormFieldType.RichText;
  value: string;
}

export interface IDateField extends IFormField {
  type: FormFieldType.Date;
  value: Date | null;
}

export interface IImageField extends IFormField {
  type: FormFieldType.Image;
  value: string | string[] | null;
  options: {
    type: "round" | "square";
    multiple?: boolean;
  };
}

export interface IPageField extends IFormField {
  type: FormFieldType.PageSelector;
  value: string | ComboboxItem | null;
  options: {
    types: PageType[];
  };
}

export type PreviewField = {
  type: FormFieldType;
  name: string;
  label: string;
  value: any;
};

export enum MentionType {
  Text = "text",
}

export type FormFields =
  | ITextField
  | ISelectField
  | IRichTextField
  | IDateField
  | IImageField
  | IPageField;

export type Fields = FormFields[];

export type PreviewFields = PreviewField[];

declare global {
  export namespace PrismaJson {
    type FieldsField = Fields;

    type PreviewFieldsField = PreviewFields;

    type PageTypeField = PageType;

    type MentionTypeField = MentionType;
  }
}
