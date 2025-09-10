import "@/styles/globals.css";
import { Metadata } from "next";

import { Nav } from "@/components/navbar";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: { default: "Home | Dashboard", template: "%s | Dashboard" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
      <div className="min-h-screen max-w-6xl m-auto text-foreground bg-[#131315] font-sans antialiased">
        <Nav />
        <main className="container mx-auto max-w-6xl pt-6 px-6 flex-grow">
          {children}
        </main>
      </div>
    </Providers>
  );
}
