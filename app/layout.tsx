import type { Metadata } from "next";
import { Josefin_Sans, Rock_Salt } from "next/font/google";
import Header from "@/components/layout/Header";
import FolderStack from "@/components/layout/FolderStack";
import "./globals.css";

// Fonts are downloaded at build time and served from this site (no Google
// request when someone visits). Each one becomes a CSS variable, used in globals.css.

// Big headings: rough, hand-drawn marker lettering.
const headingFont = Rock_Salt({
  variable: "--font-heading",
  weight: "400", // Rock Salt only comes in one weight
  subsets: ["latin"],
});

// Everything else: clean and geometric, easy to read.
const bodyFont = Josefin_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prerna | Portfolio",
  description: "Portfolio of Prerna Nayak, designer and architect.", // shown by Google and in link previews
};

// Every page sits inside its own open folder in the folder stack.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <Header />
        <FolderStack>{children}</FolderStack>
      </body>
    </html>
  );
}
