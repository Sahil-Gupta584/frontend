"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { ReactNode, useState } from "react";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ReactQueryProvider>
        <ToastProvider placement="top-center" />
        <NextThemesProvider {...themeProps}>
          {children}
        </NextThemesProvider>
      </ReactQueryProvider>
    </HeroUIProvider>
  );
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
