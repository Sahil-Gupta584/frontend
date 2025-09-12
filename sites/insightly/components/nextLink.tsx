import Link from "next/link";

function NextLink({
  icon,
  text,
  blank,
  href,
}: {
  text: string;
  icon?: boolean;
  href: string;
  blank?: true;
}) {
  return (
    <Link
      className="underline mx-1 hover:text-white transition"
      href={href}
      target={blank ? "_blank" : "_self"}
    >
      {text}
    </Link>
  );
}

export default NextLink;
