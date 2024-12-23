"use client";

import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    ArrowDownToLine,
    CheckCircle,
    Leaf,
    RotateCcw,
    PhoneCall,
} from "lucide-react";
import ProductList from "@/components/product/ProductList";
import SubscribeToNewsletter from "@/components/SubscribeToNewsletter";
import useStore from "@/context/useStore";
import Link from "next/link";
import ProductListSkeleton from "@/components/product/skeleton/ProductListSkeleton";
import { useRouter } from "next/navigation";

const perks = [
    {
        name: "Fast Shipping",
        Icon: ArrowDownToLine,
        desc: "Get your latest fashion picks delivered swiftly to your doorstep, ready for you to step out in style.",
    },
    {
        name: "Trusted Quality",
        Icon: CheckCircle,
        desc: "Every item in our collection is handpicked and inspected for the finest quality, ensuring you always look your best.",
    },
    {
        name: "Sustainable Fashion",
        Icon: Leaf,
        desc: "We pledge 1% of our profits towards eco-friendly initiatives, ensuring fashion with a conscience.",
    },
    {
        name: "1 Month Return Policy",
        Icon: RotateCcw,
        desc: "Not satisfied with your purchase? No worries! We offer a 1-month hassle-free return policy.",
    },
    {
        name: "24/7 Customer Service",
        Icon: PhoneCall,
        desc: "We’re here for you, anytime. Get in touch with our support team 24/7 for assistance.",
    },
    {
        name: "Easy Exchange Policy",
        Icon: CheckCircle,
        desc: "Need to exchange your item? Our simple exchange policy makes it quick and effortless.",
    },
];

export default function Home() {
    const products = useStore((state) => state.allProducts);
    const collectionsMap = {};
    const router = useRouter();

    // Populate collectionsMap with collections and their products
    products.forEach((product) => {
        // Check if the product is part of a collection
        for (const collectionName in product.collection) {
            const collection = product.collection[collectionName];
            if (collection.type && !collectionsMap[collection.type]) {
                collectionsMap[collection.type] = {
                    title: collection.title,
                    products: [],
                };
            }
            if (collectionsMap[collection.type]) {
                collectionsMap[collection.type].products.push(product);
            }
        }
    });

    const handleNavigation = () => {
        router.push("/products/category/all");
    };

    return (
        <>
            <MaxWidthWrapper>
                <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl pt-[160px]">
                    <h1 className=" text-4xl font-bold tracking-tight sm:text-6xl">
                        Your one-stop shop for premium{" "}
                        <span className=" text-red-600">fashion trends</span>.
                    </h1>
                    <p className=" mt-6 text-lg max-w-prose text-muted-foreground">
                        Welcome to AURA (Art of Uniqueness, Refined Aesthetics),
                        where our carefully curated collection of
                        fashion-forward items meets uncompromising quality and
                        style.
                    </p>
                    <div className=" flex flex-col sm:flex-row gap-4 mt-6">
                        <Button
                            // href="/products/category/all"
                            onClick={handleNavigation}
                            // className={buttonVariants()}
                        >
                            Shop the Latest Collection
                        </Button>
                        <Button variant="ghost">
                            Learn About Our Craftsmanship &rarr;
                        </Button>
                    </div>
                </div>
                {/* LIST PRODUCT */}
                {/* Dynamic Collection Rendering */}
                {products && products.length > 0 ? (
                    Object.entries(collectionsMap).map(
                        ([collectionType, { title, products }]) => (
                            <div key={collectionType} className="py-20">
                                <ProductList
                                    products={products}
                                    headerTitle={title}
                                    headerLink={"/"}
                                    size={"full"}
                                />
                            </div>
                        )
                    )
                ) : (
                    <ProductListSkeleton size="full" />
                )}
            </MaxWidthWrapper>
            <MaxWidthWrapper className="">
                <section className="border-t py-20">
                    <div className=" grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
                        {perks.map((perk) => (
                            <div
                                key={perk.name}
                                className=" text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                            >
                                <div className=" md:flex-shrink-0 flex justify-center">
                                    <div className=" h-16 w-16 items-center flex justify-center rounded-full bg-red-100 text-red-900">
                                        {<perk.Icon className=" w-1/3 h-1/3" />}
                                    </div>
                                </div>
                                <div className=" mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                                    <h3 className=" text-md font-medium text-inherit">
                                        {perk.name}
                                    </h3>
                                    <p className=" my-3 text-sm text-muted-foreground">
                                        {perk.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </MaxWidthWrapper>
            <MaxWidthWrapper>
                <SubscribeToNewsletter />
            </MaxWidthWrapper>
        </>
    );
}
