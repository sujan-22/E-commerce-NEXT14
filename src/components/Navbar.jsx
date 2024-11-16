/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Cart from "./cart/Cart";
import useStore from "@/context/useStore";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Dialogbox from "./Dialogbox";
const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { categories, setUserData, userData } = useStore();
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const fallbackFilterItems = [{ key: "all", label: "All" }];

  const fetchUniqueCategories = async () => {
    if (categories.length > 0) {
      const formattedCategories = [
        { key: "all", label: "all" },
        ...categories.map((cat) => ({ key: cat, label: cat })),
      ];
      setUniqueCategories(formattedCategories);
    } else {
      setUniqueCategories(fallbackFilterItems);
    }
  };

  useEffect(() => {
    if (session) {
      setUserData(session);
    }
  }, [session, setUserData]);

  useEffect(() => {
    fetchUniqueCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const handleCategoryChange = (value) => {
    setOpen(false);
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams);

    // Navigate to the new URL without redundant category query parameter
    router.push(`/products/category/${value}?${params.toString()}`);
  };

  const navigation = {
    categories: [
      {
        featured: [
          {
            name: "New Arrivals",
            href: "#",
            imageSrc:
              "https://tailwindui.com/plus/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
            imageAlt:
              "Drawstring top with elastic loop closure and textured interior padding.",
          },
          {
            name: "Artwork Tees",
            href: "#",
            imageSrc:
              "https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-06.jpg",
            imageAlt:
              "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
          },
        ],
        sections: uniqueCategories.map((category) => ({
          name: category.label, // Use `label` to show the category name
        })),
      },
    ],
    pages: [{ name: "Home", href: "/" }],
  };

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white/50 backdrop-blur-lg pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <div className="flex px-4 pb-2 pt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-primary data-[selected]:text-primary"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pb-8 pt-10"
                  >
                    <ul className="space-y-5">
                      {category.sections.map((item) => {
                        return (
                          <li
                            key={item.key}
                            className={
                              "font-medium text-gray-900 cursor-pointer "
                            }
                            onClick={() => handleCategoryChange(item.name)}
                          >
                            {item.name.charAt(0).toUpperCase() +
                              item.name.slice(1)}
                          </li>
                        );
                      })}
                    </ul>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                {userData ? (
                  <Button onClick={() => signOut()}>Logout</Button>
                ) : (
                  <a
                    href="/auth/signin"
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    Sign in
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindui.com/plus/img/flags/flag-canada.svg"
                  className="block h-auto w-5 flex-shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Normal screen size */}

      <header className="bg-white/50 backdrop-blur-lg fixed top-0 w-full z-[100000]">
        <p className="flex h-6 items-center justify-center bg-primary px-4 text-sm font-small text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav aria-label="Top" className=" mx-2 px-4 sm:px-6 lg:px-8 ">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <HamburgerMenuIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <h1 className=" text-primary text-3xl font-extralight ">
                    DIGI
                  </h1>
                </Link>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover className="flex" key={category}>
                      <div className="relative flex">
                        <PopoverButton className="relative z-50 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-gray-800 data-[open]:border-transparent data-[open]:text-primary">
                          Categories
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full text-sm text-muted-foreground transition data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 top-1/2 bg-white shadow"
                        />

                        <div className="relative bg-white">
                          <div className="mx-2 px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {category.featured.map((item) => (
                                  <div
                                    key={item.name}
                                    className="group relative text-base sm:text-sm"
                                  >
                                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                      <img
                                        alt={item.imageAlt}
                                        src={item.imageSrc}
                                        className="object-cover object-center"
                                      />
                                    </div>
                                    <a
                                      href={item.href}
                                      className="mt-6 block font-medium text-gray-900"
                                    >
                                      <span
                                        aria-hidden="true"
                                        className="absolute inset-0 z-10"
                                      />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1">
                                      Shop now
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid">
                                <ul className="space-y-5">
                                  {category.sections.map((item) => {
                                    return (
                                      <li
                                        key={item.key}
                                        className={
                                          "font-medium text-gray-900 cursor-pointer "
                                        }
                                        onClick={() =>
                                          handleCategoryChange(item.name)
                                        }
                                      >
                                        {item.name.charAt(0).toUpperCase() +
                                          item.name.slice(1)}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {userData ? (
                    <Button
                      onClick={() => signOut()}
                      variant="default"
                      className="text-sm font-mediu"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Dialogbox />
                  )}
                </div>

                <div className="hidden lg:ml-8 lg:flex">
                  <a
                    href="#"
                    className="flex items-center text-gray-700 hover:text-gray-800"
                  >
                    <img
                      alt=""
                      src="https://tailwindui.com/plus/img/flags/flag-canada.svg"
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <a
                    href="#"
                    className="p-2 text-gray-400 hover:text-muted-foreground"
                  >
                    <span className="sr-only">Search</span>
                    <SearchIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-primary"
                    />
                  </a>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                  {/* <a
                                        href="#"
                                        className="group -m-2 flex items-center p-2"
                                    >
                                        <ShoppingBag
                                            aria-hidden="true"
                                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-muted-foreground"
                                        />
                                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                            0
                                        </span>
                                        <span className="sr-only">
                                            items in cart, view bag
                                        </span>
                                    </a> */}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
