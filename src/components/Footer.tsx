"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import MaxWidthWrapper from "./utility/MaxWidthWrapper";
import { Separator } from "./ui/separator";

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = ["/verify-email", "/sign-up", "/sign-in"];

  return (
    <footer className="flex-grow-0 pt-8">
      <MaxWidthWrapper>
        <div>
          <Separator />
          {pathsToMinimize.includes(pathname) ? null : (
            <div className="py-8">
              <div className="flex justify-center">
                {/* <Icons.logo className="h-12 w-auto" /> */}
                <Link
                  href="/"
                  className="text-lg font-extrabold font-sans tracking-wider hover:text-muted-foreground uppercase transition-all duration-200 ease-in-out"
                >
                  <span className="text-primary">Polaris</span>
                </Link>
              </div>
            </div>
          )}

          {pathsToMinimize.includes(pathname) ? null : (
            <div>
              <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div
                    aria-hidden="true"
                    className="absolute bg-muted inset-0 bg-gradient-to-br bg-opacity-90"
                  />
                </div>

                <div className="text-center relative mx-auto max-w-sm">
                  <h3 className="font-semibold text-primary">
                    Become a seller
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    If you&apos;d like to sell high-quality products, you can do
                    so in minutes.{" "}
                    <Link
                      href="/sign-in?as=seller"
                      className="whitespace-nowrap font-medium text-primary hover:text-muted-foreground"
                    >
                      Get started &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className=" text-center text-muted-foreground text-sm">
            Developed by{" "}
            <Link
              className=" underline"
              href={"https://github.com/jaypatel125"}
            >
              Jay Patel
            </Link>{" "}
            &{" "}
            <Link className=" underline" href={"https://github.com/sujan-22"}>
              Sujan Rokad
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
