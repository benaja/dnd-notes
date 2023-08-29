import { UseControllerProps, useController } from "react-hook-form";
import useUpload from "~/lib/hooks/useUpload";
import Spinner from "../../ui/Spinner";
import Icon from "../../ui/Icon";
import AppImage from "../../ui/AppImage";
import { HTMLProps } from "react";
import { cn } from "~/lib/utils";
import useInput from "~/lib/hooks/useInput";

export default function AvatarImageInput({
  value,
  onChange,
  ...props
}: HTMLProps<HTMLDivElement> & {
  value?: string | null;
  onChange?: (value: string | null) => void;
}) {
  const { internalValue, onInput } = useInput(value ?? null, onChange);
  const { getRootProps, getInputProps, isUploading, files } = useUpload({
    multiple: false,
    onChange(value) {
      let file = Array.isArray(value) ? value[0] : value;
      onInput(file);
    },
  });

  return (
    <div
      {...props}
      {...getRootProps()}
      className={cn(
        "flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-50",
        props.className,
      )}
    >
      <input {...getInputProps()} />

      {isUploading && (
        <p className="text-blue-600">
          <Spinner />
        </p>
      )}

      {!isUploading && !internalValue && <Icon>image</Icon>}

      {!isUploading && internalValue && (
        <AppImage
          src={internalValue}
          width={100}
          height={100}
          className="h-full w-full rounded-full object-cover"
          alt="Uploaded image"
        />
      )}
    </div>
  );
}
