import { Fields, PageType, PreviewFields } from "~/jsonTypes";

export const pagePreviewFields = {
  id: true,
  title: true,
  type: true,
  previewFields: true,
};

export type PagePreview = {
  id: string;
  title: string;
  type: PageType;
  previewFields: PreviewFields;
};
