import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

export default function Container({
  children,
  className,
  as: Tag = "div",
  ...rest
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-content px-6 md:px-10", className)} {...rest}>
      {children}
    </Tag>
  );
}
