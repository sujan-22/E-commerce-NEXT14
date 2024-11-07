/* eslint-disable @next/next/no-img-element */
"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone from "react-dropzone";
import { Loader2, MousePointerSquareDashed, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useStore from "@/context/useStore";
import Product from "@/components/product/Product";
import { MdCancel } from "react-icons/md";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const Page = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { uploadedImageUrls } = useStore();
    const setUploadedImageUrls = useStore(
        (state) => state.setUploadedImageUrls
    );
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
            startTransition(() => {
                router.push("/addproduct/details");
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error(`Upload error. Please try again later`);
        } finally {
            setIsUploading(false);
        }
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
            <div className="flex justify-end w-full mt-4">
                <Button
                    onClick={() => handleUpload(files)}
                    disabled={files.length === 0 || isPending || isUploading}
                    className="mt-4"
                >
                    {isUploading ? "Uploading..." : "Upload Image(s)"}
                </Button>
            </div>
            {/* Preview Section */}
            <div className="max-w-full overflow-hidden px-2">
                <Carousel
                    opts={{
                        align: "center",
                    }}
                    className="w-full max-w-screen-lg"
                >
                    <CarouselContent className="flex">
                        {uploadedImageUrls.map((file, index) => (
                            <CarouselItem
                                key={index}
                                className="basis-full sm:basis-1/2 lg:basis-1/3"
                            >
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex p-6">
                                            <img
                                                src={file}
                                                alt=""
                                                className="w-full"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Carousel Arrows with Responsive Positioning */}
                    <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10" />
                </Carousel>
            </div>

            <div className="grid cursor-pointer grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-4 w-full">
                {uploadedImageUrls && uploadedImageUrls.length > 0
                    ? uploadedImageUrls.map((file, index) => (
                          <div key={index} className="relative">
                              {/* Remove Icon */}
                              <div className=" absolute top-1 left-1 z-20">
                                  <MdCancel
                                      className="w-5 h-5  hover:cursor-pointer text-secondary-foreground hover:text-muted-foreground  transition-colors"
                                      aria-label="Remove image"
                                  />
                              </div>
                              <Product
                                  initialImage={file}
                                  size={"medium"}
                                  isFeatured={"true"}
                              />
                          </div>
                      ))
                    : files.map((file, index) => (
                          <div key={index} className="relative">
                              <div className=" absolute top-1 left-1 z-20">
                                  <MdCancel
                                      className="w-5 h-5  hover:cursor-pointer text-secondary-foreground hover:text-muted-foreground  transition-colors"
                                      aria-label="Remove image"
                                  />
                              </div>
                              <Product
                                  initialImage={URL.createObjectURL(file)}
                                  size={"medium"}
                                  isFeatured={"true"}
                              />
                          </div>
                      ))}
            </div>
        </div>
    );
};

export default Page;
