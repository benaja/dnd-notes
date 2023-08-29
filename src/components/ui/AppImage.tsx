import getConfig from "next/config";
import Image from "next/image";

export default function AppImage(props: {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const { publicRuntimeConfig } = getConfig();

  if (!props.src) return null;

  return (
    <Image
      {...props}
      src={publicRuntimeConfig.S3_BUCKET_ENDPOINT + "/" + props.src}
      alt={props.alt || "no alt text provided"}
    />
  );
}
