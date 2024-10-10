// pages/products/[productId]/page.js

"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import ImageGallery from "@/components/ImageGallery";
import ProductActions from "@/components/ProductActions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import useStore from "@/context/useStore";

const Page = ({ params }) => {
    const products = useStore((state) => state.allProducts);
    const addToCart = useStore((state) => state.addToCart);

    const id = params.productId;
    const product = products.find((prod) => prod.id === parseInt(id));
    const [selectedColor, setSelectedColor] = useState(
        product.availableColors[0]
    );

    const [selectedSize, setSelectedSize] = useState(product.availableSizes[0]);

    // Find the product by ID from dummy data

    // If the product is not found
    if (!product) {
        return (
            <MaxWidthWrapper>
                <p>Product not found</p>
                <Link href="/">Go back to homepage</Link>
            </MaxWidthWrapper>
        );
    }

    const handleAddToCart = () => {
        const productConfig = {
            productId: product.id,
            quantity: 1,
            selectedColor,
            selectedSize,
        };
        addToCart(productConfig);
    };

    return (
        <MaxWidthWrapper>
            <div
                className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row lg:items-start py-6 relative"
                data-testid="product-container"
            >
                <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                    <ProductInfo product={product} />
                    <ProductTabs product={product} />
                </div>

                {/* Middle part */}
                <div className="block w-full relative ">
                    <ImageGallery images={product.availableImages || []} />
                </div>

                {/* Right part */}
                <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                    <ProductActions
                        options={product.availableColors}
                        title="Color"
                        onSelect={(color) => setSelectedColor(color)}
                    />
                    <ProductActions
                        options={product.availableSizes}
                        title="Size"
                        onSelect={(size) => setSelectedSize(size)}
                    />
                    <Separator />
                    <div className="flex items-center gap-x-2 text-md font-semibold">
                        {product.collection.onsale.newPrice ? (
                            <>
                                <span>
                                    {formatPrice(
                                        `${product.collection.onsale.newPrice}`
                                    )}
                                </span>
                                <span className="line-through text-muted-foreground">
                                    {formatPrice(`${product.price}`)}
                                </span>
                            </>
                        ) : (
                            <span>{formatPrice(`${product.price}`)}</span>
                        )}
                    </div>
                    <Button onClick={handleAddToCart}>Add to cart</Button>
                </div>
            </div>
            <div
                className="content-container my-16 sm:my-32"
                data-testid="related-products-container"
            >
                {/* TODO: RELATED PRODUCTS */}
            </div>
        </MaxWidthWrapper>
    );
};

export default Page;
