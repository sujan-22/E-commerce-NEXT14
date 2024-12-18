import Image from "next/image";
import React from "react";

interface CartLineImageProps {
    imageUrl: string;
    altText: string;
}

const CartLineImage: React.FC<CartLineImageProps> = ({ imageUrl, altText }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
                className="object-contain"
                quality={100}
                alt={altText}
                src={imageUrl}
                fill
            />
        </div>
    );
};

export default CartLineImage;
