import classNames from "classnames";

export default function Icon({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <span
      className={classNames("material-symbols-outlined", className)}
      {...props}
    >
      {children}
    </span>
  );
}
