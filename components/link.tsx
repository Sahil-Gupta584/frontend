import { TClassName } from "@/lib/types";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";
export default function LinkComponent({
  href,
  text,
  isBold,
  isIcon,
  className,
}: {
  href: string;
  text: string;
  isBold?: boolean;
  isIcon?: boolean;
  className?: TClassName;
}) {
  return (
    <Link
      href={href}
      className={`underline text-white inline-flex items-center gap-1 ${isBold ? "font-medium" : ""} text-nowrap mx-2 hover:text-pink-400 transition decoration-gray-500 ${className} `}
    >
      {text}
      {isIcon && <HiExternalLink />}
    </Link>
  );
}
