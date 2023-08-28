import { UseControllerProps, useController } from "react-hook-form";
import useUpload from "~/lib/hooks/useUpload";
import Spinner from "../ui/Spinner";
import Icon from "../ui/Icon";
import AppImage from "../ui/AppImage";

export default function AvatarImageInput({ ...props }: UseControllerProps) {
  const { field, fieldState } = useController(props);
  const { getRootProps, getInputProps, isUploading, files } = useUpload({
    multiple: false,
    onChange(value) {
      field.onChange(value);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-50"
    >
      <input {...getInputProps()} />

      {isUploading && (
        <p className="text-blue-600">
          <Spinner />
        </p>
      )}

      {!isUploading && files.length === 0 && <Icon>image</Icon>}

      {!isUploading && files.length === 1 && (
        <AppImage
          src={files[0]}
          width={100}
          height={100}
          className="h-full w-full rounded-full object-cover"
          alt="Uploaded image"
        />
      )}
    </div>
  );
}
