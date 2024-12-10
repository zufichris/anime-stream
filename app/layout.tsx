import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-context";
import "./globals.css";
import type { Metadata } from "next";
import { staticData } from "@/static";

export const metadata: Metadata = {
  title: `${staticData.appName} - Your Streaming Platform`,
  description: staticData.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-black dark:text-white">
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
