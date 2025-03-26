"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { bodyFont1, logoFont } from "@/app/fonts";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className={cn(
        logoFont.className,
        "flex justify-between items-center"
      )}
    >
      {/* Logo */}
      <Link className="text-4xl w-fit" href={"/"}>
        t<span className="italic text-blue-400 -ml-1.5">a</span>iip
        <span className={cn("text-sm -ml-1 text-foreground/70 font-bold", bodyFont1.className)}>.com</span>
      </Link>

      {/* Right Section (Theme Toggle + Time + Socials) */}
      <div className="flex gap-4 items-center">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
          <Moon className="hidden h-5 w-5 dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
