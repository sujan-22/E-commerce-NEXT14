import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Category from "@/hooks/useCategory";
import Product from "@/hooks/useProducts";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata = {
    title: "Fashion E-commerce",
    description: "A modern fashion e-commerce website",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`font-sans scrollbar-hide`}>
                <ReactQueryProvider>
                    <Navbar />
                    <main className="flex flex-col min-h-[calc(100vh-2.5rem-1px)] pt-[104.8px]">
                        <div className="flex flex-1 flex-col h-full">
                            {children}
                        </div>
                        <Footer />
                    </main>
                    <Product />
                    <Category />
                </ReactQueryProvider>
            </body>
        </html>
    );
}
