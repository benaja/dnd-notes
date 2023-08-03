import { generateComponents } from "@uploadthing/react";

import type { OurFileRouter } from "~/app1/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
