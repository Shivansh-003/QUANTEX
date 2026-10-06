"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors
    console.error("Application Error Boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="border border-destructive/50 bg-destructive/10 rounded-lg p-6 max-w-md space-y-3">
        <h2 className="text-lg font-semibold text-destructive">
          Application Error Encountered
        </h2>
        <p className="text-xs font-mono text-muted-foreground break-all">
          {error.message || "An unexpected application error occurred."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => reset()}
          className="mt-2 font-mono text-xs"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
