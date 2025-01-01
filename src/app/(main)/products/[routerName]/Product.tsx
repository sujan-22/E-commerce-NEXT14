/* eslint-disable @next/next/no-img-element */
// pages/products/[productId]/page.js

"use client";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ImageGallery from "@/components/ImageGallery";
import ProductActions from "@/components/product/ProductActions";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import ProductList from "@/components/product/ProductList";
import { useFormatPrice } from "@/lib/utils";
import useCartStore from "@/context/useCartStore";
import useUserStore from "@/context/useUserStore";
import { useToast } from "@/hooks/use-toast";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";
import { Collection, Product as ProductType, Variant } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
    fetchProductsByCategory,
    getProductSeller,
} from "../../actions/product-actions/actions";

export interface ProductsWithVariantsAndCollection extends ProductType {
    variants: Variant[];
    collection: Collection;
}

const Product = ({
    product,
}: {
    product: ProductsWithVariantsAndCollection;
}) => {
    const { formatPrice } = useFormatPrice();
    const { toast } = useToast();
    const { addToCart } = useCartStore();
    const { currentUser } = useUserStore();
    const { data: relatedProducts } = useQuery({
        queryKey: ["get-products-by-category"],
        queryFn: async () =>
            await fetchProductsByCategory(product.category, true, product.id),
        retry: 4,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const { data: seller } = useQuery({
        queryKey: ["get-seller-by-product"],
        queryFn: async () => await getProductSeller(product.routerName),
        retry: 4,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    const distinctColors = Array.from(
        new Set(product.variants.map((variant) => variant.color))
    );
    const distinctSizes = Array.from(
        new Set(product.variants.map((variant) => variant.size))
    );

    const [selectedColor, setSelectedColor] = useState(distinctColors[0]);
    const [selectedSize, setSelectedSize] = useState(distinctSizes[0]);

    const [isMobile, setIsMobile] = useState(false);

    const selectedVariant = useMemo(() => {
        return product.variants.find(
            (variant) =>
                variant.color === selectedColor && variant.size === selectedSize
        );
    }, [selectedColor, selectedSize, product.variants]);

    // Check screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Initialize
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAddToCart = () => {
        if (selectedVariant) {
            addToCart(
                product.id,
                selectedVariant.id,
                currentUser,
                1,
                selectedColor,
                selectedSize,
                product
            );
            toast({
                description: "Item successfully added to your cart.",
            });
        } else {
            toast({
                description: "The selected variant is unavailable.",
            });
        }
    };

    const handleButtonDisable = () => {
        if (product.variants.length === 0) {
            return false;
        }

        return selectedVariant ? selectedVariant.stock === 0 : true;
    };

    return (
        <MaxWidthWrapper>
            <div
                className="max-w-[1440px] w-full mx-auto flex flex-col lg:flex-row lg:items-start py-6 relative"
                data-testid="product-container"
            >
                {/* Left part */}
                <div className="flex flex-col lg:sticky lg:top-48 lg:max-w-[300px] w-full lg:py-8 gap-y-6">
                    <ProductInfo product={product} />
                </div>

                {/* Middle part */}
                <div className="block w-full relative">
                    {isMobile ? (
                        <Carousel
                            opts={{ align: "center" }}
                            className="w-full mt-6"
                        >
                            <CarouselContent className="flex">
                                {product?.images.map((file, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                    >
                                        <div className="relative">
                                            <Card>
                                                <CardContent className="flex p-2 relative">
                                                    <img
                                                        src={file}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-md"
                                                        style={{
                                                            aspectRatio:
                                                                "1 / 1",
                                                        }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                        </Carousel>
                    ) : (
                        <ImageGallery images={product?.images || []} />
                    )}
                </div>

                {/* Right part */}
                <div className="flex flex-col lg:sticky lg:top-48 lg:py-8 lg:max-w-[300px] w-full py-8 gap-y-6">
                    {product && distinctColors.length > 0 && (
                        <ProductActions
                            options={distinctColors}
                            title="Color"
                            onSelect={(color) => setSelectedColor(color)}
                        />
                    )}
                    {product && distinctSizes.length > 0 && (
                        <ProductActions
                            options={distinctSizes}
                            title="Size"
                            onSelect={(size) => setSelectedSize(size)}
                        />
                    )}

                    {distinctSizes.length > 0 &&
                        product &&
                        distinctColors.length > 0 && <Separator />}
                    <div className="flex items-center gap-x-2 text-sm font-semibold">
                        {product.price !== product.basePrice ? (
                            <>
                                <span>{formatPrice(`${product.price}`)}</span>
                                <span className="line-through text-muted-foreground">
                                    {formatPrice(`${product?.basePrice}`)}
                                </span>
                            </>
                        ) : (
                            <span>{formatPrice(`${product?.basePrice}`)}</span>
                        )}
                    </div>
                    <Button
                        disabled={handleButtonDisable()}
                        variant={"outline"}
                        onClick={handleAddToCart}
                    >
                        {handleButtonDisable() ? (
                            <>Out of stock</>
                        ) : (
                            <>Add to cart</>
                        )}
                    </Button>
                    <ProductTabs seller={seller} />
                </div>
            </div>
            {relatedProducts && relatedProducts.length > 0 && (
                <div
                    className="content-container lg:my-16 sm:my-32"
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
                </div>
            )}
        </MaxWidthWrapper>
    );
};

export default Product;
