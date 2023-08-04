import classNames from "classnames";
import Link, { LinkProps } from "next/link";

export default function AppLink({
  children,
  className,
  ...props
}: LinkProps & { children: React.ReactNode; className?: string }) {
  return (
    <Link
      {...props}
      className={classNames("text-blue-600 hover:text-blue-800", className)}
    >
      {children}
    </Link>
  );
}
