import "@/styles/globals.css";
import { Metadata } from "next";
import localFont from "next/font/local";

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
  data-website-id="68c55806002464fbde15"
  data-domain="insightly.appwrite.network"
  src="https://insightly.appwrite.network/script.js">
  </script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        window.__APP_CONFIG__ = {
          HOSTNAME: "${process.env.NEXT_PUBLIC_HOSTNAME}",
          other: "${process.env.HOSTNAME}"
        }
      `,
          }}
        />
      </head>
      <body className={sen.className}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
