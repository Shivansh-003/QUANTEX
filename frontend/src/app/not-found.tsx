import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="border border-terminal-border bg-terminal-secondary rounded-lg p-6 max-w-md space-y-3">
        <h2 className="text-xl font-bold font-mono text-primary">404 — Page Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested path does not exist on the platform.
        </p>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "sm", className: "mt-2 font-mono text-xs" })}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
