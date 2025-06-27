import React from "react";
import { JSX } from "react/jsx-runtime";
import { IconHome, IconUser, IconMessage } from "@tabler/icons-react";

type NavItem = {
  name: string;
  link: string;
  icon: JSX.Element;
};

export const navItems: NavItem[] = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];
