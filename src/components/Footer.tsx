import { bodyFont2 } from "@/app/fonts";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { Github, Linkedin, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <div
      className={cn(
        "w-full flex justify-between items-center gap-2 p-3 px-20 text-foreground/70",
        bodyFont2.className
      )}
    >
      <div className="text-xl">© Raunak M.</div>
      <div>
        <ul className="flex gap-2 items-center">
          <li>
            <Button variant="ghost" asChild size="icon">
              <a href="https://github.com/RaunakDiesFromCode" target="_blank">
                <Github />
              </a>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild size="icon">
              <a
                href="https://www.linkedin.com/in/raunak-manna/"
                target="_blank"
              >
                <Linkedin />
              </a>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild size="icon">
              <a href="https://x.com/RaunakM298742" target="_blank">
                <Twitter />
              </a>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild size="icon">
              <a
                href="https://www.instagram.com/raunakisannoying/"
                target="_blank"
              >
                <Instagram />
              </a>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild size="icon">
              <a
                href="mailto:raunakmanna43@gmail.com&subject=I%20saw%20your%20portfolio"
                target="_blank"
              >
                <Mail />
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
