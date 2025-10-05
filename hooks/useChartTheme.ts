"use client";

import { useEffect, useMemo, useState } from "react";

export type ChartTheme = {
  primary: string; // line and visitor color
  secondary: string; // revenue color
  axis: string; // axis text color
  grid: string; // grid stroke color
  content1?: string; // background surface
  muted?: string; // neutral text/border
};

export function useChartTheme(): ChartTheme {
  const [colors, setColors] = useState<ChartTheme>({
    primary: "#fd366e",
    secondary: "#e78468",
    axis: "#6b7280",
    grid: "#e5e7eb",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const getVar = (name: string, fallback: string) => {
      const v = getComputedStyle(root).getPropertyValue(name).trim();
      return v || fallback;
    };

    // HeroUI exposes CSS vars like --heroui-colors-primary, --heroui-colors-secondary, --heroui-colors-divider, --heroui-colors-default-500
    const primary = getVar("--heroui-colors-primary", "#fd366e");
    const secondary = getVar("--heroui-colors-secondary", "#e78468");
    const axis = getVar("--heroui-colors-default-500", "#6b7280");
    const grid = getVar("--heroui-colors-divider", "#e5e7eb");
    const content1 = getVar("--heroui-colors-content1", "#1d1d21");
    const muted = getVar("--heroui-colors-default-400", "#9ca3af");

    setColors({ primary, secondary, axis, grid, content1, muted });
  }, []);

  return colors;
}
