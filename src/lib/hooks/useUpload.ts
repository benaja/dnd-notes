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
  const [files, setFiles] = useState<string[]>([]);

  const uploadFile = useCallback(async (files: FileWithPath[]) => {
    setIsUploading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    let data = (await fetch("/api/s3/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json())) as { path: string }[];

    setFiles(data.map((file) => file.path));
    setIsUploading(false);
  }, []);

  useEffect(() => {
    if (multiple) {
      onChange?.(files);
    } else {
      onChange?.(files[0] ?? null);
    }
  }, [files, multiple, onChange]);

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
    files,
  };
}
