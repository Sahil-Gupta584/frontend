import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Nav } from "@/components/navbar";
import { siteConfig } from "@/config/site";
import { Providers, ReactQueryProvider } from "../providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
      <ReactQueryProvider>
        <div className="min-h-screen max-w-6xl m-auto text-foreground bg-[#131315] font-sans antialiased">
          <Nav />
          <main className="container mx-auto max-w-6xl pt-6 px-6 flex-grow">
            {children}
          </main>
        </div>
      </ReactQueryProvider>
    </Providers>
  );
}
