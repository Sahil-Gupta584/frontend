import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

import { TClassName } from "@/lib/types";
export default function LinkComponent({
  href,
  text,
  isBold,
  isIcon,
  className = "",
  blank,
}: {
  href: string;
  text: string;
  isBold?: boolean;
  isIcon?: boolean;
  className?: TClassName;
  blank?: true;
}) {
  return (
    <Link
      href={href}
      className={`underline text-white inline items-center gap-1 ${isBold ? "font-medium" : ""} text-nowrap mx-2 hover:text-pink-400 transition decoration-gray-500 ${className} `}
      target={blank ? "_blank" : "_self"}
    >
      {text}
      {isIcon && <HiExternalLink className="inline" />}
    </Link>
  );
}
