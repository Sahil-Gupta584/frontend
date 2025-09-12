import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";

import { cardVariants } from "../docs/revenue-attribution-guide/components/commonCards";

function StepCard({
  desc,
  imgFileName,
  title,
}: {
  title: string;
  desc: string;
  imgFileName: string;
}) {
  const MotionCard = motion(Card);

  return (
    <MotionCard
      isPressable
      shadow="sm"
      className="group border-8 hover:border-gray-700 transition rounded-xl h-full grow border-primary/50 p-0! max-w-[15rem] m-auto"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
    >
      <CardBody className="overflow-visible ">
        <motion.img
          className="w-full object-scale-down h-[140px] rounded-t-xl scale-[1.02] transition"
          src={`/images/landing/${imgFileName}`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.25 }}
        />
      </CardBody>
      <CardBody className="text-small flex flex-col justify-between h-full p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-400 p-2">{desc}</p>
      </CardBody>
    </MotionCard>
  );
}
export default function HowItWorks() {
  return (
    <article>
      <p className="text-primary text-center mb-4 font-bold">HOW IT WORKS?</p>
      <p className="text-3xl font-extrabold text-center mb-10">
        Find revenue opportunities in 3 steps
      </p>
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-2 justify-center">
        <StepCard
          title="1. Install Insightly script"
          desc="You'll see beautiful web analytics in 1 minute. Oh, and the script loads super fast (4kb)."
          imgFileName="scriptimage.png"
        />

        <FaArrowRightLong className="text-[40px] text-neutral-500 rotate-90 md:rotate-0 m-auto  md:block" />

        <StepCard
          title="2. Connect revenue data"
          desc="Link your favorite payment processor so DataFast can attribute revenue to your traffic sources."
          imgFileName="paymentProviders.webp"
        />

        <FaArrowRightLong className="text-[40px] text-neutral-500 rotate-90 md:rotate-0 m-auto  md:block" />

        <StepCard
          title="3. Grow your business"
          desc="DataFast analyzes your funnel to find what makes people buy, and tells you exactly how to get more of them."
          imgFileName="dashboard.webp"
        />
      </div>
    </article>
  );
}
