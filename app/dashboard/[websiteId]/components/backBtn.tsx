import { Button } from "@heroui/react";
import Link from "next/link";
import { IoIosArrowRoundUp } from "react-icons/io";

const BackBtn = ({ text, pathname }: { text: string; pathname: string }) => {
  return (
    <Button
      className="bg-content1 border border-neutral-700 self-start mb-5"
      startContent={<IoIosArrowRoundUp className="-rotate-90 size-6" />}
      as={Link}
      href={pathname}
    >
      {text}
    </Button>
  );
};

export default BackBtn;
