"use client";

import { Show, UserButton, useAuth } from "@clerk/nextjs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "./shadcn/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitch from "./ThemeSwitch";
import { TbMenuDeep } from "react-icons/tb";
import { navLinks } from "@/lib/constants";
import { useEffect, useState } from "react";

const MobileNav = () => {
  const { userId } = useAuth();
  const [redirectTo, setRedirectTo] = useState<string>("/");

  useEffect(() => {
    setRedirectTo(window.location.pathname);
  }, []);

  const pathname = usePathname();

  return (
    <nav className="mobile-nav">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={"/assets/images/logo.png"}
          alt="logo"
          width={100}
          height={35}
        />
      </Link>
      <div className="flex gap-4">
        <ThemeSwitch />
        <Show when="signed-out">
          <div className="rounded-button bg-primary">
            <Link
              href={`/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`}
            >
              Sign In
            </Link>
          </div>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
        <Sheet>
          <SheetTrigger>
            <TbMenuDeep className="w-6 h-6" color="#F50056" />
          </SheetTrigger>
          <SheetContent className="sm:w-64 sheet-background-color border-none">
            <ul className="mt-12 flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = link.href === pathname;

                return (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className={`${
                          isActive && "text-primary"
                        } font-semibold text-xl`}
                        onClick={() => setRedirectTo(link.href)}
                      >
                        {link.title}
                      </Link>
                    </SheetClose>
                  </li>
                );
              })}

              <Show when="signed-in">
                <li key="profile">
                  <SheetClose asChild>
                    <Link
                      href={`/profile/${userId}`}
                      className={`${
                        pathname.includes("/profile") && "text-primary"
                      } font-semibold text-xl`}
                      onClick={() => setRedirectTo(`/profile/${userId}`)}
                    >
                      My Designs
                    </Link>
                  </SheetClose>
                </li>
              </Show>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNav;
