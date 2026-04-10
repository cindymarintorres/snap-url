import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

type Props = VariantProps<typeof buttonVariants> & {
  href: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
};

/**
 * LinkButton — renders a Next.js <Link> styled as a shadcn Button.
 * Use instead of <Button asChild><Link/></Button> since base-ui Button doesn't support asChild.
 */
export function LinkButton({ href, id, className, variant, size, children, target, rel }: Props) {
  return (
    <Link
      href={href}
      id={id}
      className={cn(buttonVariants({ variant, size }), className)}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
