"use client";
import { AvatarIcon } from "../../public/svgs";
import Link from "next/link";
// import Image from "next/image";
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Button,
  Image,
} from "@nextui-org/react";

export default function NavbarMenu() {
  return (
    <Navbar maxWidth="full" className="">
      <NavbarBrand>
        <Image
          src="/images/tctlogo.png"
          width="100"
          height="50"
          alt="tctlogo"
        />
        <h1 className="text-xl uppercase text-cyan-700 italic font-semibold">
          hệ thống quản lý giao thông thông minh
        </h1>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button variant="bordered" className="border-none">
              <AvatarIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              textValue="profile"
              className="h-14 gap-2"
            >
              <p className="font-semibold">Signed in as Admin </p>
            </DropdownItem>
            <DropdownItem key="system" textValue="system">
              <Link href="/dashboard">System</Link>
            </DropdownItem>
            <DropdownItem key="configurations" textValue="configurations">
              <Link href="#">Configurations</Link>
            </DropdownItem>
            <DropdownItem key="logout" textValue="logout" color="danger">
              <Link href="#">Log Out</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
