import { addToast } from "@heroui/react";
import z from "zod";

export async function tryCatchWrapper<T>({
  callback,
  errorMsg,
  successMsg,
  warningMsg,
}: {
  callback: () => T;
  errorMsg?: string;
  successMsg?: string;
  warningMsg?: string;
}) {
  try {
    const res = await callback();

    if (successMsg) {
      addToast({
        color: "success",
        description: successMsg,
      });
    }

    return res;
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      const firstError = `${error.issues[0].path}: ${error.issues[0].message}`;

      addToast({
        color: "danger",
        title: "Validation Error",
        description: firstError,
      });
    } else {
      // Handle other errors
      addToast({
        color: "danger",
        title: "Error",
        description: errorMsg || "Server Error",
      });
    }
  }
  if (warningMsg) {
    addToast({
      color: "warning",
      title: "Warning",
      description: errorMsg || "Server Warning",
    });
  }
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }

  return num.toString();
}

export const getCountryName = (code: string) => {
  if (!code || code === "-99") return "Unknown";

  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(code) || "Unknown"
    );
  } catch {
    return "Unknown";
  }
};
