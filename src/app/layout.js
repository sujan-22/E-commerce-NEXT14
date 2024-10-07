import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// Import the Inter font with the required subsets and weights
const inter = Inter({
    subsets: ["latin"],
    weight: ["300"],
    variable: "--font-inter",
});

export const metadata = {
    title: "Fashion E-commerce",
    description: "A modern fashion e-commerce website",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            {/* Apply Inter along with fallback fonts */}
            <body
                className={`${inter.variable} font-sans bg-gray-50 text-gray-900`}
            >
                <Navbar />
                <main className="flex flex-col min-h-[calc(100vh-2.5rem-1px)] pt-[104.8px]">
                    <div className="flex flex-1 flex-col h-full">
                        {children}
                    </div>
                    <Footer />
                </main>
            </body>
        </html>
    );
}
