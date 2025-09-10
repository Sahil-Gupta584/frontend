import { HTMLAttributes } from "react";

import { getFaviconUrl } from "@/lib/utils/server";

export function Favicon({
  className,
  domain,
}: {
  domain: string;
  className?: HTMLAttributes<HTMLImageElement>["className"];
}) {
  return (
    <img
      src={getFaviconUrl(domain)}
      alt={domain}
      className={`size-5 rounded ${className}`}
    />
  );
}
