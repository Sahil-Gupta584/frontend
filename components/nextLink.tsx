import Link from "next/link";

import { TClassName } from "@/lib/types";

function NextLink({
  text,
  blank,
  href,
  className,
}: {
  className?: TClassName;
  text: string;
  href: string;
  blank?: true;
}) {
  return (
    <Link
      className={`underline mx-1 hover:text-white transition ${className}`}
      href={href}
      target={blank ? "_blank" : "_self"}
    >
      {text}
    </Link>
  );
}

export default NextLink;
