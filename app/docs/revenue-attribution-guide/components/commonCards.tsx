import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

import { TPaymentProviders } from "@/lib/types";
import ChipComponent from "@/components/chip";

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.98 },
};
function CommonCards({ provider }: { provider: TPaymentProviders }) {
  const MotionCard = motion(Card);

  return (
    <>
      <MotionCard
        isPressable
        shadow="sm"
        as={Link}
        // @ts-expect-error
        href={`/docs/${provider?.toLowerCase()}-checkout-api`}
        className="group border-1 border-neutral-200 dark:border-gray-800 hover:border-neutral-300 dark:hover:border-gray-700 transition rounded-xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
      >
        <CardBody className="overflow-visible p-0">
          <motion.img
            alt={provider}
            className="w-full object-cover h-[140px] rounded-t-xl"
            src="/images/checkout-api.webp"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
          />
        </CardBody>
        <CardBody className="text-small justify-between">
          <b className="flex gap-2 items-center p-2 text-[16px]">
            <span>{provider} Checkout API</span>

            <ChipComponent child={"🔥 Popular"} />
          </b>
          <p className="text-desc p-2">
            You use the Checkout Session API on your backend to create a payment
            page. Pass Insightly cookies as metadata to {provider} API to
            attribute revenue.
          </p>
        </CardBody>
      </MotionCard>

      <MotionCard
        isPressable
        shadow="sm"
        as={Link}
        // @ts-expect-error
        href={`/docs/${provider.toLocaleLowerCase()}-payment-links`}
        className="group border-1 border-neutral-200 dark:border-gray-800 hover:border-neutral-300 dark:hover:border-gray-700 transition rounded-xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
      >
        <CardBody className="overflow-visible p-0">
          <motion.img
            alt={provider}
            className="w-full object-cover h-[140px] rounded-t-xl"
            src="/images/payment-link.webp"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25 }}
          />
        </CardBody>
        <CardBody className="text-small justify-between">
          <b className="flex gap-2 items-center p-2 text-[16px]">
            {provider} Payment Links
            <ChipComponent child={" No-code"} />
          </b>
          <p className="text-desc p-2">
            You use {provider} Payment Links no-code solution to create a
            payment page. Add a custom field to the Payment Link success URL to
            attribute revenue.
          </p>
        </CardBody>
      </MotionCard>
    </>
  );
}

export default CommonCards;
