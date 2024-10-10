// pages/products/[productId]/page.js

"use client";
import products from "@/data/products.js";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import ImageGallery from "@/components/ImageGallery";
import ProductActions from "@/components/ProductActions";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/context/GlobalContext";

const Page = ({ params }) => {
    const id = params.productId;
    const { addToCart } = useGlobalContext();

    // Find the product by ID from dummy data
    const product = products.products.find((prod) => prod.id === parseInt(id));

    // If the product is not found
    if (!product) {
        return (
            <MaxWidthWrapper>
                <p>Product not found</p>
                <Link href="/">Go back to homepage</Link>
            </MaxWidthWrapper>
        );
    }

    const images =
        product.availableColors.flatMap((color) => color.images) || [];

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
                    <ImageGallery images={images || []} />
                </div>

                {/* Right part */}
                <div className="flex flex-col lg:sticky lg:top-48 lg:py-0 lg:max-w-[300px] w-full py-8 gap-y-6">
                    <ProductActions
                        options={product.availableColors}
                        title="Color"
                    />
                    <ProductActions
                        options={product.availableSizes}
                        title="Size"
                    />
                    <Button onClick={() => addToCart(product.id)}>
                        Add to cart
                    </Button>
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
