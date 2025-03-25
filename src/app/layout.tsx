import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "taip | A minimal typing experience",
  description: "Not powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* <div className="vignette"></div> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="fixed top-0 left-0 right-0 z-50 p-4 px-20">
            <Navbar />
          </nav>
          <main className="pt-3">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
