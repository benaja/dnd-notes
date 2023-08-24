import { useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { generateClientDropzoneAccept } from "uploadthing/client";
import Spinner from "../ui/Spinner";
import AppImage from "../ui/AppImage";

export default function S3ImageUploader({
  multiple = false,
  value = null,
  onChange,
}: {
  multiple?: boolean;
  value?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
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
