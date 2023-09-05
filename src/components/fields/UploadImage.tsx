// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { FileWithPath } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "~/lib/uploadthing";
import Spinner from "../ui/Spinner";
import Image from "next/image";
import isEqual from "lodash/isEqual";

const generatePermittedFileTypes = (config?: any) => {
  const fileTypes = config ? Object.keys(config) : [];

  const maxFileCount = config
    ? Object.values(config).map((v: any) => v && v.maxFileCount)
    : [];

  return { fileTypes, multiple: maxFileCount.some((v) => v && v > 1) };
};

export type UploadThingFile = {
  fileKey: string;
  fileUrl: string;
};

export default function UploadImage({
  multiple = false,
  value = null,
  onChange,
}: {
  multiple?: boolean;
  value: UploadThingFile | UploadThingFile[] | null;
  onChange?: (value: UploadThingFile | UploadThingFile[] | null) => void;
}) {
  const [files, setFiles] = useState<UploadThingFile[]>(
    Array.isArray(value) ? value : value ? [value] : [],
  );

  // useEffect(() => {
  //   if (isEqual(files, value)) return;

  // }, [files, value]);

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (files) => {
        if (!files) return;

        setFiles(files);
        onChange?.(files);
      },
      onUploadError: () => {
        alert("error occurred while uploading");
      },
    },
  );

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const { fileTypes } = generatePermittedFileTypes(permittedFileInfo?.config);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-40 items-center justify-center bg-gray-50 "
    >
      <input {...getInputProps()} />

      {isUploading && (
        <p className="text-blue-600">
          <Spinner />
        </p>
      )}

      {!isUploading && files.length === 0 && (
        <p className="text-center">
          Drop file here!
          <br />
          Or click to select file.
        </p>
      )}

      {!isUploading && files.length === 1 && (
        <Image
          src={files[0].fileUrl}
          width={400}
          height={400}
          className="h-full w-full object-contain"
          alt="Uploaded image"
        />
      )}

      {!isUploading && files.length > 1 && (
        <p>{files.length} images selected</p>
      )}
    </div>
  );
}
