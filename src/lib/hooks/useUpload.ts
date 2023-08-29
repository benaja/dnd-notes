import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";

export default function useUpload({
  multiple,
  onChange,
}: {
  multiple?: boolean;
  onChange?: (files: string | string[] | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (files: FileWithPath[]) => {
      setIsUploading(true);

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      let data = (await fetch("/api/s3/upload", {
        method: "POST",
        body: formData,
      }).then((res) => res.json())) as { path: string }[];

      let filePaths = data.map((file) => file.path);

      setIsUploading(false);

      if (multiple) {
        onChange?.(filePaths);
      } else {
        onChange?.(filePaths[0] ?? null);
      }
    },
    [multiple, onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      uploadFile(acceptedFiles);
    },
    [uploadFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image"]),
    multiple,
  });

  return {
    getRootProps,
    getInputProps,
    isUploading,
  };
}
