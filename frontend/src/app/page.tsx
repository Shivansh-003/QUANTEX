import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          QUANTEX Platform Foundation
        </h1>
        <p className="text-sm text-muted-foreground">
          Core architectural, frontend, backend, and infrastructure foundation established.
        </p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 text-left font-mono text-xs border border-terminal-border rounded-lg p-4 bg-terminal-secondary">
        <div>
          <span className="text-muted-foreground">Frontend Status:</span>{" "}
          <span className="text-financial-bull">OPERATIONAL</span>
        </div>
        <div>
          <span className="text-muted-foreground">Type System:</span>{" "}
          <span className="text-financial-bull">STRICT</span>
        </div>
        <div>
          <span className="text-muted-foreground">App Architecture:</span>{" "}
          <span className="text-primary">Next.js App Router</span>
        </div>
        <div>
          <span className="text-muted-foreground">Design Tokens:</span>{" "}
          <span className="text-primary">Terminal Slate</span>
        </div>
      </div>

      <div className="flex gap-4">
        <a
          href="/api/v1/health"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm", className: "font-mono text-xs" })}
        >
          Backend Health Status
        </a>
      </div>
    </div>
  );
}
