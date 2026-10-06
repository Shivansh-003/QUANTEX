import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUANTEX Platform",
  description: "Quantitative Investment, Trading & Market Research Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-terminal-primary text-foreground flex flex-col font-sans">
        <header className="border-b border-terminal-border bg-terminal-secondary/80 backdrop-blur px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-bold tracking-wider text-primary">
              QUANTEX
            </span>
            <span className="text-xs text-muted-foreground border border-terminal-border px-1.5 py-0.5 rounded font-mono">
              Platform Shell
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-financial-bull inline-block" />
            <span className="text-xs font-mono text-muted-foreground">Foundation Ready</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-terminal-border bg-terminal-secondary px-6 py-2 text-xs font-mono text-muted-foreground flex justify-between items-center">
          <span>QUANTEX System Architecture</span>
          <span>Environment: Production Foundation</span>
        </footer>
      </body>
    </html>
  );
}
