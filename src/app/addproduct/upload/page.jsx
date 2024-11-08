/* eslint-disable @next/next/no-img-element */
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone from "react-dropzone";
import {
    Loader2,
    MousePointerSquareDashed,
    Image,
    InfoIcon,
} from "lucide-react";
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

const Page = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { uploadedImageUrls, removeUploadedImageUrl, setUploadedImageUrls } =
        useStore();
    // const setUploadedImageUrls = useStore(
    //     (state) => state.setUploadedImageUrls
    // );
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onDropRejected = (files) => {
        const [file] = files;
        setIsDragOver(false);
        toast.error(`${file.file.type} type is not supported`);
    };

    const onDropAccepted = (acceptedFiles) => {
        setFiles(acceptedFiles);
        setIsDragOver(false);
    };

    const handleUpload = async () => {
        setIsUploading(true);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload files.");
            }

            const data = await response.json();

            setUploadedImageUrls(data.fileUrls);
            toast.message("Image(s) uploaded successfully!", {
                description: "Upload more image(s) or continue",
            });
            startTransition(() => {
                router.push("/addproduct/upload");
                setFiles([]);
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error(`Upload error. Please try again later`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = async (file) => {
        try {
            removeUploadedImageUrl(file);

            const response = await fetch("/api/delete-image", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileUrl: file,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Image removed successfully!");
                console.log("Image removed from S3:", data.message);
            } else {
                toast.error(data.error || "Failed to remove image.");
                console.error(
                    "Failed to remove image:",
                    data.error || data.details
                );
            }
        } catch (error) {
            toast.error("An error occurred while removing the image.");
            console.error("Error removing image:", error);
        }
    };

    const handleRemoveFile = (file) => {
        const updatedFiles = files.filter((f) => f !== file);
        setFiles(updatedFiles); // Update the state with the removed file
    };

    return (
        <div className="flex flex-col items-center my-16 w-full">
            <div
                className={cn(
                    "relative h-full w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-xl flex flex-col justify-center items-center",
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
                            {isUploading || isPending ? (
                                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
                            ) : isDragOver ? (
                                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
                            ) : (
                                <Image
                                    className="h-6 w-6 text-zinc-500 mb-2"
                                    alt=""
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
            <div className="flex justify-between w-full mt-4">
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
            {uploadedImageUrls.length > 0 && (
                <div className=" w-full">
                    <Alert className="mt-2">
                        <InfoIcon className="h-5 w-5" />
                        <AlertTitle className="text-lg font-semibold">
                            Uploaded Images
                        </AlertTitle>
                    </Alert>
                    <div className="max-w-full overflow-hidden mt-4">
                        {/* Carousel */}
                        <Carousel opts={{ align: "center" }} className="w-full">
                            <CarouselContent className="flex">
                                {uploadedImageUrls.map((file, index) => (
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
                                ))}
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
                        <InfoIcon className="h-5 w-5" />
                        <AlertTitle className="text-lg font-semibold">
                            Preview your selected images before uploading.
                        </AlertTitle>
                        <AlertDescription>
                            Once you&apos;re satisfied with your selection,
                            click the upload button to add them to your
                            collection, or remove them by clicking the cancel
                            button.
                        </AlertDescription>
                    </Alert>
                    <div className="max-w-full overflow-hidden mt-4">
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
        </div>
    );
};

export default Page;
