"use client";

import Product from "./Product";
import { buttonVariants } from "../ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Product as ProductType } from "@/context/useStore";
import Link from "next/link";
import { useFormatPrice } from "@/lib/utils";

interface ProductListProps {
    products: ProductType[];
    headerLink?: string;
    headerTitle?: string;
    size: "small" | "medium" | "large" | "full" | "square";
    linkTitle?: string;
    isRelated?: boolean;
}

const ProductList = ({
    products,
    headerLink = "",
    headerTitle = "",
    size,
    linkTitle,
    isRelated,
}: ProductListProps) => {
    const { formatPrice } = useFormatPrice();
    return (
        <div className=" py-20">
            <div className="flex justify-between mb-2">
                {headerLink !== "" && (
                    <>
                        <h2 className="text-xl font-bold">{headerTitle}</h2>
                        {products.length > 2 && (
                            <Link
                                href={headerLink}
                                className={`flex items-center ${buttonVariants({
                                    size: "sm",
                                })}`}
                            >
                                {linkTitle ? (
                                    <>{linkTitle}</>
                                ) : (
                                    "View Collection "
                                )}
                                <ArrowTopRightIcon className="ml-1 w-4 h-4" />
                            </Link>
                        )}
                    </>
                )}
            </div>
            <div className="grid cursor-pointer grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {(isRelated ? products.slice(0, 3) : products).map(
                    (product) => (
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
                            <div className="flex justify-between mt-4 px-2 items-start">
                                <p
                                    className="text-md"
                                    data-testid="product-title"
                                >
                                    {product.name}
                                </p>
                                <div className="flex items-center gap-x-2 text-md font-semibold">
                                    {product.collection.onsale?.newPrice ? (
                                        <>
                                            <span className="line-through text-muted-foreground">
                                                {formatPrice(
                                                    `${product.price}`
                                                )}
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
                    )
                )}
            </div>
        </div>
    );
};

export default ProductList;
