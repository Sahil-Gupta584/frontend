import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { MODE } from "@/appwrite/serverConfig";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title:
    "Insightly |  Understand who’s visiting, where they come from and what keeps them engaged.",
};

const sen = localFont({
  src: [
    {
      path: "../public/fonts/Sen-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Sen-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Sen-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Sen-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Sen-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sen",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className="dark:bg-[#19191C]">
      <head>
        <script
          defer
          data-website-id="68d2611f0011c3785cb2"
          data-domain="insightly-three.vercel.app"
          data-allow-localhost={MODE === "prod" ? "false" : "true"}
          src="/script.js"
        ></script>
        <script
          defer
          data-website-id="68cd7f8d0a106d351d532350"
          data-domain="insightly-three.vercel.app"
          src="https://datafa.st/js/script.js"
        ></script>
      </head>
      <body className={sen.className}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
