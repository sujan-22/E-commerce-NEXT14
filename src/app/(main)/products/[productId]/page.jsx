// pages/products/[productId]/page.js

"use client";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
// import Link from "next/link";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ImageGallery from "@/components/ImageGallery";
import ProductActions from "@/components/product/ProductActions";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import useStore from "@/context/useStore";
import { Skeleton } from "@/components/ui/skeleton";
import ProductList from "@/components/product/ProductList";
import { useFormatPrice } from "@/lib/utils";
import useCartStore from "@/context/useCartStore";
import useUserStore from "@/context/useUserStore";
import { useToast } from "@/hooks/use-toast";

const Page = ({ params }) => {
    const { formatPrice } = useFormatPrice();
    const { toast } = useToast();
    const products = useStore((state) => state.allProducts);
    const { addToCart } = useCartStore();
    const { currentUser } = useUserStore();
    // const syncCartWithServer = useStore((state) => state.syncCartWithServer);
    // const userData = useStore((state) => state.userData);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");

    const id = params.productId;
    const product = products.find((prod) => prod.id === parseInt(id));

    useEffect(() => {
        if (product) {
            setSelectedColor(product.availableColors?.[0] || "");
            setSelectedSize(product.availableSizes?.[0] || "");
        }
    }, [product]);

    const relatedProducts = products.filter(
        (p) => p.category === product.category && p.id !== product.id
    );

    if (!products) {
        return (
            <MaxWidthWrapper>
                <div className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row lg:items-start py-6 relative">
                    {/* Left side */}
                    <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                        <Skeleton className="h-24 w-full mb-6" />{" "}
                        {/* ProductInfo skeleton */}
                        <Skeleton className="h-10 w-3/4 mb-6" />{" "}
                        {/* ProductTabs skeleton */}
                    </div>

                    {/* Middle part */}
                    <div className="block w-full relative">
                        <div className="flex items-start relative">
                            <div className="flex flex-col flex-1 sm:mx-16 gap-y-4">
                                <div className="relative aspect-[29/34] w-full overflow-hidden">
                                    <Skeleton />
                                </div>
                            </div>
                        </div>
                        {/* ImageGallery skeleton */}
                    </div>

                    {/* Right part */}
                    <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                        <Skeleton className="h-10 w-3/4 mb-6" />{" "}
                        {/* ProductActions skeleton (Color selection) */}
                        <Skeleton className="h-10 w-3/4 mb-6" />{" "}
                        {/* ProductActions skeleton (Size selection) */}
                        <Separator />
                        <Skeleton className="h-6 w-1/3 mb-6" />{" "}
                        {/* Price skeleton */}
                        <Skeleton className="h-10 w-full" />{" "}
                        {/* Add to Cart button skeleton */}
                    </div>
                </div>
            </MaxWidthWrapper>
        );
    }

    const handleAddToCart = () => {
        const cartItem = {
            productId: product.id,
            quantity: 1,
            selectedColor,
            selectedSize,
        };
        addToCart(cartItem, currentUser, products);
        toast({
            description: "Item successfully added to your cart.",
        });
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
                    <ImageGallery images={product?.availableImages || []} />
                </div>

                {/* Right part */}
                <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                    {Array.isArray(product?.availableColors) &&
                        product.availableColors.length > 0 && (
                            <ProductActions
                                options={product?.availableColors}
                                title="Color"
                                onSelect={(color) => setSelectedColor(color)}
                            />
                        )}
                    {Array.isArray(product?.availableSizes) &&
                        product.availableSizes.length > 0 && (
                            <ProductActions
                                options={product?.availableSizes}
                                title="Size"
                                onSelect={(size) => setSelectedSize(size)}
                            />
                        )}

                    <Separator />
                    <div className="flex items-center gap-x-2 text-sm font-semibold">
                        {product?.collection.onsale.newPrice ? (
                            <>
                                <span>
                                    {formatPrice(
                                        `${product.collection.onsale.newPrice}`
                                    )}
                                </span>
                                <span className="line-through text-muted-foreground">
                                    {formatPrice(`${product?.price}`)}
                                </span>
                            </>
                        ) : (
                            <span>{formatPrice(`${product?.price}`)}</span>
                        )}
                    </div>
                    <Button onClick={handleAddToCart}>Add to cart</Button>
                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div
                    className="content-container my-16 sm:my-32"
                    data-testid="related-products-container"
                >
                    <ProductList
                        products={relatedProducts}
                        size="full"
                        headerTitle="Related Products"
                        headerLink={`/products/category/${product.category}`}
                        linkTitle="View more"
                        isRelated
                    />
                    {/* TODO: RELATED PRODUCTS */}
                </div>
            )}
        </MaxWidthWrapper>
    );
};

export default Page;
