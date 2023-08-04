import { UseControllerProps, useController } from "react-hook-form";
import { UploadThingFile } from "./UploadImage";

export default function ImageInput({
  value,
  onChange,
  ...props
}: {
  value?: string | null;
  onChange?: (value: string) => void;
} & UseControllerProps) {
  const { field, fieldState } = useController(props);
}
