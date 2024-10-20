"use client";

import { useEffect, useState } from "react";
import Product from "./Product";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { formatPrice } from "@/lib/utils";

const ProductList = ({ products, headerLink = "", headerTitle = "", size }) => {
    return (
        <div className=" py-20">
            <div className="flex justify-between mb-2">
                {headerLink !== "" && (
                    <>
                        <h2 className="text-xl font-bold">{headerTitle}</h2>
                        <Link
                            href={headerLink}
                            className={`flex items-center ${buttonVariants({
                                size: "sm",
                            })}`}
                        >
                            View Collection{" "}
                            <ArrowTopRightIcon className="ml-1 w-4 h-4" />
                        </Link>
                    </>
                )}
            </div>
            <div className="grid cursor-pointer grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col">
                        <Link href={`/products/${product.id}`}>
                            <Product
                                initialImage={product.availableImages[0]}
                                className="mx-auto"
                                size={size}
                                isFeatured={true}
                            />
                        </Link>
                        {/* <Product
                            initialImage={product.availableColors[0].images[0]}
                            className="mx-auto"
                            size={size}
                            isFeatured={true}
                        /> */}
                        <div className="flex justify-between mt-4 px-2">
                            <p className="text-md" data-testid="product-title">
                                {product.name}
                            </p>
                            <div className="flex items-center gap-x-2 text-md font-semibold">
                                {product.collection.onsale.newPrice ? (
                                    <>
                                        <span className="line-through text-muted-foreground">
                                            {formatPrice(`${product.price}`)}
                                        </span>
                                        <span>
                                            {formatPrice(
                                                `${product.collection.onsale.newPrice}`
                                            )}
                                        </span>
                                    </>
                                ) : (
                                    <span>
                                        {formatPrice(`${product.price}`)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
