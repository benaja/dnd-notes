import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Spinner from "../ui/Spinner";
import AppImage from "../ui/AppImage";
import useUpload from "~/lib/hooks/useUpload";

export default function S3ImageUploader({
  multiple = false,
  value = null,
  readOnly = false,
  onChange,
}: {
  multiple?: boolean;
  value?: string | string[] | null;
  readOnly?: boolean;
  onChange?: (value: string | string[] | null) => void;
}) {
  const { getRootProps, getInputProps, isUploading, files } = useUpload({
    multiple,
    onChange,
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-40 items-center justify-center bg-gray-50 "
    >
      <input readOnly={readOnly} {...getInputProps()} />

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
        <AppImage
          src={files[0]}
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
