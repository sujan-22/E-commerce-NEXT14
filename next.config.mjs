/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["nightowl-ecom.s3.us-east-2.amazonaws.com"],
        loader: "default",
    },
};

export default nextConfig;
