import Link from "next/link";

function NextLink({
  icon,
  text,
  href,
}: {
  text: string;
  icon?: boolean;
  href: string;
}) {
  return (
    <p className="underline">
      <Link href={href}>{text}</Link>
    </p>
  );
}

export default NextLink;
