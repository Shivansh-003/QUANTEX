export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-financial-cyan animate-pulse" />
        <span>Loading application view...</span>
      </div>
    </div>
  );
}
