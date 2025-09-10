import { TClassName } from "@/lib/types";
import { Button } from "@heroui/react";
import Link from "next/link";
import { IoIosArrowRoundUp } from "react-icons/io";

const BackBtn = ({
  text,
  pathname,
  className,
}: {
  text: string;
  pathname: string;
  className?: TClassName;
}) => {
  return (
    <Button
      className={`bg-content1 border border-neutral-700 self-start mb-5 ${className}`}
      startContent={<IoIosArrowRoundUp className="-rotate-90 size-6" />}
      as={Link}
      href={pathname}
    >
      {text}
    </Button>
  );
};

export default BackBtn;
