"use client";
import { Button, Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

import { cardVariants } from "../docs/revenue-attribution-guide/components/commonCards";

import { plans } from "@/lib/billingsdk-config";
import { PricingTableOne } from "@/components/billingsdk/pricing-table-one";

const MotionCard = motion(Card);

function PricingCard({
  plan,
  price,
  features,
  highlight,
  buttonLabel,
}: {
  plan: string;
  price: string;
  features: string[];
  highlight?: boolean;
  buttonLabel: string;
}) {
  return (
    <MotionCard
      shadow="sm"
      className={`group border-4 rounded-xl h-full min-w-[20rem] min-h-[24rem]   ${
        highlight ? "border-primary bg-primary/5" : "border-gray-700"
      } `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <CardBody className="p-6 flex flex-col gap-6 justify-between">
        <div>
          <h2 className="text-2xl font-bold">{plan}</h2>
          <p className="text-3xl font-extrabold">{price}</p>
        </div>

        <ul className="text-gray-400 flex flex-col gap-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {f.includes("Coming Soon") ? (
                <span className="italic text-yellow-400">{f}</span>
              ) : (
                f
              )}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          color={highlight ? "primary" : "default"}
          variant={highlight ? "solid" : "bordered"}
          className="mt-4 font-semibold"
        >
          {buttonLabel}
        </Button>
      </CardBody>
    </MotionCard>
  );
}

export default function Pricing() {
  async function handleCheckout(plan: string) {
    console.log({ plan });
  }

  return (
    <article id="pricing">
      <p className="text-primary text-center mb-4 font-bold">PRICING</p>
      <p className="text-3xl font-extrabold text-center mb-10">
        Simple, transparent pricing
      </p>

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {/* <PricingCard
          plan="Free"
          price="$0 /m"
          buttonLabel="Get Started"
          features={[
            "5 Websites",
            "10k Events",
            "Basic Analytics",
            "Email Support",
          ]}
        />
        <PricingCard
          plan="Pro"
          price="$29 /m"
          buttonLabel="Upgrade to Pro"
          highlight
          features={[
            "20 Websites",
            "100k Events",
            "Advanced Attribution",
            "Priority Support",
            "Funnel Insights (Coming Soon)",
          ]}
        /> */}
        <PricingTableOne
          className="bg-transparent"
          onPlanSelect={handleCheckout}
          theme={"classic"}
          plans={plans}
        />
      </div>
    </article>
  );
}
