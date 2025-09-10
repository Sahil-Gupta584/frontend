import { TClassName } from "@/lib/types";
import { Chip } from "@heroui/react";

export default function ChipComponent({
  child,
  isMargin,
  classname,
}: {
  child: React.ReactNode | string;
  isMargin?: boolean;
  classname?: TClassName;
}) {
  return (
    <Chip
      size="sm"
      radius="sm"
      className={`bg-content2 px-1 pl-0 ${isMargin ? "mx-2" : ""} ${classname}`}
      variant="bordered"
    >
      {child}
    </Chip>
  );
}
