import { UseControllerProps, useController } from "react-hook-form";
import { UploadThingFile } from "./UploadImage";
import S3ImageUploader from "./S3ImageUploader";

export default function ImageInput({
  value,
  onChange,
  label,
  ...props
}: {
  label?: string;
  value?: string | null;
  onChange?: (value: string) => void;
} & UseControllerProps) {
  const { field, fieldState } = useController(props);

  return (
    <div>
      {label && <label className="font-medium">{label}</label>}
      <S3ImageUploader
        value={field.value}
        onChange={(value) => {
          field.onChange(value);
        }}
      />

      <p className="mt-1 h-4 leading-4 text-red-600">
        {fieldState?.error?.message}
      </p>
    </div>
  );
}
