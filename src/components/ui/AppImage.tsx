import getConfig from "next/config";
import Image from "next/image";

export default function AppImage(props: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const { publicRuntimeConfig } = getConfig();

  return (
    <Image
      {...props}
      src={publicRuntimeConfig.S3_BUCKET_ENDPOINT + "/" + props.src}
      alt={props.alt}
    />
  );
}
