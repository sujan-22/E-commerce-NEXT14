import Image from "next/image";

interface ImageGallery {
    images: string[];
}

const ImageGallery: React.FC<ImageGallery> = ({ images }) => {
    return (
        <div className="flex items-start relative">
            <div className="flex flex-col flex-1 sm:mx-16 gap-y-4">
                {images.map((image, index) => {
                    return (
                        <div
                            key={image}
                            className="relative aspect-[29/34] w-full overflow-hidden border rounded-md"
                            id={image}
                        >
                            <Image
                                src={image}
                                priority={index <= 2 ? true : false}
                                className="absolute inset-0 rounded-rounded"
                                alt={`Product image ${index + 1}`}
                                fill
                                sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                                style={{
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImageGallery;
