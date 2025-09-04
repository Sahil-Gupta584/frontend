"use client";

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

export function Nav() {
  return (
    <Navbar
      shouldHideOnScroll
      classNames={{ wrapper: "px-0" }}
      className="bg-transparent "
    >
      {/* Brand */}
      <NavbarBrand>
        <Link href="/dashboard" className="font-bold text-white text-lg">
          Insightly
        </Link>
      </NavbarBrand>

      {/* Right side user menu */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
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
                  src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                }}
                classNames={{
                  name: "text-white",
                  description: "text-neutral-400",
                }}
                className="cursor-pointer hover:bg-neutral-700 transition p-2"
                name="Junior Garcia"
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
                    description="@jrgarciadev"
                    name="Junior Garcia"
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
                      <option>System</option>
                      <option>Dark</option>
                      <option>Light</option>
                    </select>
                  }
                >
                  🎨 Theme
                </DropdownItem>
                <DropdownItem key="logout" className="text-pink-500">
                  🚪 Log Out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
