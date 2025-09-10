import Logo from "@/components/logo";
import { User } from "@/lib/types";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Link from "next/link";

function LandingPageNav({ user }: { user: User | null }) {
  return (
    <Navbar className="bg-[#19191C] border-b border-b-neutral-800">
      <NavbarBrand>
        <Link
          href="/dashboard"
          className="flex gap-2 font-bold text-white text-lg leading-normal"
        >
          <Logo />
          Insightly
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem
          className="hover:underline cursor-pointer"
          as={Link}
          href="/#pricing"
        >
          Pricing
        </NavbarItem>
        {/* <NavbarItem
          className="hover:underline cursor-pointer"
          as={Link}
          href="/#faq"
        >
          FAQ
        </NavbarItem> */}
        {/* <NavbarItem as={Link} href='/#pricing'>Reviews</NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            color="primary"
            variant="bordered"
            as={Link}
            href={user && user.$id ? "/dashboard" : "/auth"}
          >
            {user && user.$id ? "Dashboard" : "Log in"}
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default LandingPageNav;
