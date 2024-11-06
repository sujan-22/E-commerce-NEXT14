"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Dropzone from "react-dropzone";
import { Loader2, MousePointerSquareDashed, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useStore from "@/context/useStore";
import Product, { ImageOrPlaceholder } from "@/components/product/Product";

const Page = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { setUploadedImageUrls, uploadedImageUrls } = useStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDropRejected = (files) => {
    const [file] = files;
    setIsDragOver(false);
    // toast({
    //   title: `${file.file.type} type is not supported`,
    //   description: "Please choose a PNG, JPG, or JPEG image instead",
    //   variant: "destructive",
    // });
  };

  const onDropAccepted = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setIsDragOver(false);
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setError(null);

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

      setUploadedImageUrls(data.fileUrls || []);
      startTransition(() => {
        router.push("/addproduct/details");
      });
    } catch (err) {
      setError(err.message || "An error occurred.");
      //   toast({
      //     title: "Upload Error",
      //     description: error,
      //     variant: "destructive",
      //   });
    } finally {
      setIsUploading(false);
      console.log(uploadedImageUrls);
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
                    <span className="font-semibold">Drop file</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                )}
              </div>
              {!isPending && (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG, WEBP</p>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 w-full">
        {files.map((file, index) => (
          <Product
            key={index}
            initialImage={URL.createObjectURL(file)}
            size={"sqaure"}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
