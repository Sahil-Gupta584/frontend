import { addToast } from "@heroui/react";
import z from "zod";

export async function tryCatchWrapper<T>({
  callback,
  errorMsg,
  successMsg,
}: {
  callback: () => T;
  errorMsg?: string;
  successMsg?: string;
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
}
