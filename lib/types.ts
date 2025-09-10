import { HTMLAttributes } from "react";

export type TPaymentProviders = "Stripe" | "Polar" | "Dodo" | "None";
export type TClassName = HTMLAttributes<HTMLDivElement["className"]> | string;

export interface User {
  $id: string | undefined;
  name?: string;
  email?: string;
  image?: string;
}
