import { cn } from "~/lib/utils";

export default function AppContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(className, "mx-auto w-full max-w-6xl px-4")}>
      {children}
    </div>
  );
}
