import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

/* -----------------------------
   Metadata (SEO)
------------------------------ */
export const metadata: Metadata = {
  title: "AgentFlow AI",
  description: "AI-powered agent system",
};

/* -----------------------------
   Viewport (MOBILE FIX ✅)
------------------------------ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/* -----------------------------
   Root Layout
------------------------------ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
