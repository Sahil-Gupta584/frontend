"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { LuDot } from "react-icons/lu";

import BackBtn from "../dashboard/[websiteId]/components/backBtn";

import { Nav } from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function Anchor({
    href,
    text,
    isIcon,
  }: {
    href: string;
    text: string;
    isBold?: boolean;
    isIcon?: boolean;
  }) {
    return (
      <Link
        href={href}
        className={`hover:text-primary ${pathname === href ? "text-primary" : ""} transition inline-flex items-center  whitespace-nowrap`}
      >
        {isIcon && <LuDot className="stroke-[5px]" />}
        {text}
      </Link>
    );
  }

  return (
    <main className=" max-w-[68rem] mx-auto p-10 pt-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Nav
          brandChild={
            <p className="cursor-pointer text-desc text-lg border-l-1 border-l-gray-500 px-2 ml-2">
              DOCUMENTATION
            </p>
          }
          endContent={<BackBtn pathname="/dashboard" text="Dashboard" />}
          className="mb-4"
        />
        <div className="flex gap-10 mt-6">
          <ul className="flex flex-col gap-2">
            <Link
              href="/docs/revenue-attribution-guide"
              className={`relative hover:text-primary ${pathname === "/docs/revenue-attribution-guide" ? "text-primary" : ""} transition inline-flex items-center  whitespace-nowrap`}
            >
              <LuDot className="stroke-[5px] absolute -left-[18px]" />
              Get Started
            </Link>

            <Anchor
              href="/docs/stripe-checkout-api"
              text="Stripe Checkout API"
            />
            <Anchor
              href="/docs/stripe-payment-links"
              text="Stripe Payment Links"
            />

            <Anchor href="/docs/polar-checkout-api" text="Polar Checkout API" />
            <Anchor
              href="/docs/polar-payment-links"
              text="Polar Payment Links"
            />

            <Anchor
              href="/docs/dodo-checkout-api"
              text="DodoPayments Checkout API"
            />
            <Anchor href="/docs/dodo-payment-links" text="DodoPayment Links" />
            <Link
              href="/docs/custom-goals"
              className={`relative hover:text-primary ${pathname === "/docs/custom-goals" ? "text-primary" : ""} transition inline-flex items-center  whitespace-nowrap`}
            >
              <LuDot className="stroke-[5px] absolute -left-[18px]" />
              Custom Goals
            </Link>
          </ul>
          {children}
        </div>
      </Suspense>
    </main>
  );
}
