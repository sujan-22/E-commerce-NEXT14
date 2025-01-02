/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
import { MousePointerSquareDashed, ImageIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useStore from "@/context/useStore";
import { MdCancel } from "react-icons/md";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { addImagesToProduct, removeImageFromProduct } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/utility/Loader";

const PageClient = ({ productId }: { productId: string }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const { allProducts } = useStore();
    const { toast } = useToast();

    const { mutate: handleRemoveImageFromProduct, isPending } = useMutation({
        mutationFn: removeImageFromProduct,
        onSuccess: () => {
            toast({
                title: "Image Removed",
                description: "The image has been removed successfully.",
            });
            window.location.reload();
        },
        onError: () => {
            toast({
                title: "Error Removing Image",
                description:
                    "An error occurred while removing the image. Please try again later.",
                variant: "destructive",
            });
        },
    });

    const { mutate: addImages, isPending: isUploading } = useMutation({
        mutationFn: addImagesToProduct,
        onSuccess: () => {
            toast({
                title: "Images Added",
                description: "The images have been added successfully.",
            });
            window.location.reload();
        },
        onError: (error) => {
            console.log(error);
            toast({
                title: "Error Adding Images",
                description:
                    "An error occurred while adding the images. Please try again later.",
                variant: "destructive",
            });
        },
    });

    const product = allProducts.find((prod) => prod.id === parseInt(productId));
    const router = useRouter();
    if (!product) {
        return (
            <div className="w-full mt-24 flex justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader />
                    <h3 className="font-semibold text-xl">Loading data...</h3>
                    <p>This won&apos;t take too long!</p>
                </div>
            </div>
        );
    }

    const onDropRejected = (files: FileRejection[]) => {
        const [file] = files;
        setIsDragOver(false);
        toast({
            description: `${file.file.type} type is not supported`,
            variant: "destructive",
        });
    };

    const onDropAccepted = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
        setIsDragOver(false);
    };

    const handleUpload = async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        addImages({ productId: parseInt(productId), formData });
    };

    const handleRemoveImage = async (file: string) => {
        handleRemoveImageFromProduct({
            productId: parseInt(productId),
            imageUrl: file,
        });
    };

    const handleRemoveFile = (file: File) => {
        const updatedFiles = files.filter((f) => f !== file);
        setFiles(updatedFiles);
    };

    return (
        <div className="flex flex-col items-center my-4 w-full">
            <div className="flex justify-between w-full">
                <Button
                    onClick={() => handleUpload(files)}
                    disabled={files.length === 0 || isPending || isUploading}
                    className="mt-4"
                >
                    {isUploading ? "Uploading..." : `Upload Image(s)`}
                </Button>

                <Button
                    onClick={() => router.push("details")}
                    disabled={isUploading}
                    className="mt-4"
                >
                    Continue &rarr;
                </Button>
            </div>

            {/* Preview Section for Uploaded Images */}
            {product && (
                <div className=" w-full">
                    <Alert className="mt-2">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle className="text-md font-semibold">
                            Current Product Images
                        </AlertTitle>
                        <AlertDescription>
                            You can add more images to this product, remove
                            existing ones or click continue to edit other
                            details
                        </AlertDescription>
                    </Alert>
                    <div className="max-w-full overflow-hidden mt-2">
                        {/* Carousel */}
                        <Carousel opts={{ align: "center" }} className="w-full">
                            <CarouselContent className="flex">
                                {product &&
                                    product.availableImages.map(
                                        (file, index) => (
                                            <CarouselItem
                                                key={index}
                                                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                            >
                                                <div className="relative">
                                                    <Card>
                                                        <CardContent className="flex p-2 relative">
                                                            <MdCancel
                                                                onClick={() =>
                                                                    handleRemoveImage(
                                                                        file
                                                                    )
                                                                }
                                                                className="w-5 h-5 absolute top-1 right-1 z-20 hover:cursor-pointer text-secondary-foreground hover:text-muted-foreground transition-colors"
                                                                aria-label="Remove image"
                                                            />
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
                                        )
                                    )}
                            </CarouselContent>

                            <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                            <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                        </Carousel>
                    </div>{" "}
                </div>
            )}

            {/* Preview Section for Files */}
            {files.length > 0 && (
                <div className=" w-full">
                    <Alert className="mt-2">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle className="text-md font-semibold">
                            Preview your selected images before uploading.
                        </AlertTitle>
                        <AlertDescription>
                            Once you&apos;re satisfied with your selection,
                            click the upload button to add them to your
                            collection, or remove them by clicking the cancel
                            button.
                        </AlertDescription>
                    </Alert>
                    <div className="max-w-full overflow-hidden mt-2">
                        {/* Carousel */}
                        <Carousel opts={{ align: "center" }} className="w-full">
                            <CarouselContent className="flex">
                                {files.map((file, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                                    >
                                        <div className="relative">
                                            <Card>
                                                <CardContent className="flex p-2 relative">
                                                    <MdCancel
                                                        onClick={() =>
                                                            handleRemoveFile(
                                                                file
                                                            )
                                                        }
                                                        className="w-5 h-5 absolute top-1 right-1 z-20 hover:cursor-pointer text-secondary-foreground hover:text-muted-foreground transition-colors"
                                                        aria-label="Remove image"
                                                    />
                                                    <img
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
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
                    </div>{" "}
                </div>
            )}
            <div
                className={cn(
                    "relative h-full w-full rounded-xl bg-gray-900/5 my-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-xl flex flex-col justify-center items-center",
                    { "ring-blue-900/25 bg-blue-900/10": isDragOver }
                )}
                style={{ minHeight: "400px" }}
            >
                <Dropzone
                    multiple={true}
                    onDropRejected={onDropRejected}
                    onDropAccepted={onDropAccepted}
                    accept={{
                        "image/jpg": [".jpg"],
                        "image/png": [".png"],
                        "image/jpeg": [".jpeg"],
                        "image/webp": [".webp"],
                    }}
                    onDragEnter={() => setIsDragOver(true)}
                    onDragLeave={() => setIsDragOver(false)}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div
                            {...getRootProps()}
                            className="h-full w-full flex flex-1 flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg"
                        >
                            <input {...getInputProps()} />
                            {isUploading ? (
                                <Loader />
                            ) : isDragOver ? (
                                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
                            ) : (
                                <ImageIcon
                                    className="h-6 w-6 text-zinc-500 mb-2"
                                    width={6}
                                    height={6}
                                />
                            )}
                            <div className="text-sm text-zinc-700 mb-2">
                                {isUploading ? (
                                    <>
                                        <p>Uploading...</p>
                                    </>
                                ) : isDragOver ? (
                                    <p>
                                        <span className="font-semibold">
                                            Drop file
                                        </span>{" "}
                                        to upload
                                    </p>
                                ) : (
                                    <p>
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </p>
                                )}
                            </div>
                            {!isPending && (
                                <p className="text-xs text-zinc-500">
                                    PNG, JPG, JPEG, WEBP
                                </p>
                            )}
                        </div>
                    )}
                </Dropzone>
            </div>
        </div>
    );
};

export default PageClient;
