import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GarageDIY | Simple garage cabinet planner",
  description: "Plan a practical garage cabinet setup in a few easy steps.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
