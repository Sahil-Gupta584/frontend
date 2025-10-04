import { Models } from "appwrite";
import { HTMLAttributes } from "react";

export type TPaymentProviders = "Stripe" | "Polar" | "Dodo" | "None";
export type TClassName = HTMLAttributes<HTMLDivElement["className"]> | string;

export interface User {
  $id: string | undefined;
  name?: string;
  email?: string;
  image?: string;
}

export type Metric = {
  label: string;
  visitors: number;
  revenue: number;
  imageUrl?: string;
  convertingVisitors?: number;
  countryCode?: string;
  conversionRate?: number;
};

export type TLiveVisitor = {
  visitorId: string;
  sessionId: string;
  $createdAt: string;
};

export type TBucket = Record<string, any>;

export type TWebsite = { $id: string; domain: string };

export interface TEvent extends Models.DefaultRow {
  visitorId: string;
  sessionId: string;
  referrer: string;
  os: string;
  browser: string;
  city: string;
  countryCode: string;
  device: string;
  $createdAt: string;
  $updatedAt: string;
}
