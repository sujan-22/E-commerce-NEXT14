// pages/products/[productId]/page.js

"use client";
import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ImageGallery from "@/components/ImageGallery";
import ProductActions from "@/components/product/ProductActions";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import useStore from "@/context/useStore";
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

const Product = ({ params }) => {
  const { formatPrice } = useFormatPrice();
  const { toast } = useToast();
  const products = useStore((state) => state.allProducts);
  const { addToCart } = useCartStore();
  const { currentUser } = useUserStore();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {/* Left part */}
        <div className="flex flex-col lg:sticky lg:top-48 lg:max-w-[300px] w-full lg:py-8 gap-y-6">
          <ProductInfo product={product} />
        </div>

        {/* Middle part */}
        <div className="block w-full relative">
          {isMobile ? (
            <Carousel opts={{ align: "center" }} className="w-full mt-6">
              <CarouselContent className="flex">
                {product?.availableImages.map((file, index) => (
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
                              aspectRatio: "1 / 1",
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
            <ImageGallery images={product?.availableImages || []} />
          )}
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
                  {formatPrice(`${product.collection.onsale.newPrice}`)}
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
          <ProductTabs product={product} />
        </div>
      </div>
      {relatedProducts.length > 0 && (
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
