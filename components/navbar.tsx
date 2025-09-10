"use client";

import { account } from "@/appwrite/clientConfig";
import { useUser } from "@/lib/hooks";
import { TClassName } from "@/lib/types";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import Logo from "./logo";

export function Nav({
  brandChild,
  endContent,
}: {
  endContent?: React.ReactNode;
  brandChild?: React.ReactNode;
  className?: TClassName;
}) {
  const user = useUser();
  const router = useRouter();
  return (
    <Navbar
      shouldHideOnScroll
      classNames={{ wrapper: "px-0" }}
      className="bg-transparent "
    >
      {/* Brand */}
      <NavbarBrand>
        <Link
          href="/dashboard"
          className="flex gap-2 font-bold text-white text-lg leading-normal"
        >
          <Logo />
          Insightly
        </Link>
        {brandChild}
      </NavbarBrand>

      {/* Right side user menu */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {endContent ? (
            endContent
          ) : (
            <Dropdown
              showArrow
              classNames={{
                base: "before:bg-neutral-800", // arrow bg
                content:
                  "p-0 border border-neutral-800 rounded-lg shadow-lg bg-[#222225]",
              }}
              radius="sm"
            >
              <DropdownTrigger>
                <User
                  avatarProps={{
                    size: "sm",
                    src: user?.image,
                  }}
                  classNames={{
                    name: "text-white",
                    description: "text-neutral-400",
                  }}
                  className="cursor-pointer hover:bg-neutral-700 transition p-2"
                  name={user?.name || "rose berry"}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User menu"
                className="p-2"
                disabledKeys={["profile"]}
                itemClasses={{
                  base: [
                    "rounded-md",
                    "text-neutral-400",
                    "transition-colors",
                    "data-[hover=true]:text-white",
                    "data-[hover=true]:bg-neutral-700",
                    "data-[selectable=true]:focus:bg-neutral-600",
                    "data-[pressed=true]:opacity-70",
                    "data-[focus-visible=true]:ring-pink-500",
                  ],
                }}
              >
                {/* Profile Section */}
                <DropdownSection showDivider aria-label="Profile & Actions">
                  <DropdownItem
                    key="profile"
                    isReadOnly
                    className="h-14 gap-2 opacity-100"
                  >
                    <User
                      avatarProps={{
                        className: "hidden",
                      }}
                      classNames={{
                        name: "text-white",
                        description: "text-neutral-400",
                      }}
                      description={user?.email}
                      name={user?.name}
                    />
                  </DropdownItem>
                  <DropdownItem key="settings">⚙️ Settings</DropdownItem>
                  <DropdownItem key="billing">💳 Billing</DropdownItem>
                </DropdownSection>

                {/* Preferences Section */}
                <DropdownSection aria-label="Preferences">
                  <DropdownItem
                    key="theme"
                    isReadOnly
                    className="cursor-default"
                    endContent={
                      <select
                        className="z-10 w-20 rounded-md text-xs border border-neutral-700 bg-[#19191C] text-neutral-400 hover:border-pink-500 transition"
                        id="theme"
                        name="theme"
                      >
                        <option>Dark</option>
                        <option>Light</option>
                      </select>
                    }
                  >
                    🎨 Theme
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-pink-500"
                    onPress={() => {
                      account.deleteSessions().then(() => router.push("/auth"));
                    }}
                  >
                    🚪 Log Out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
