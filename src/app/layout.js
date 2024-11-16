import "./globals.css";
import Navbar from "@/components/Navbar";
import Category from "@/hooks/useCategory";
import Footer from "@/components/Footer";
import Product from "@/hooks/useProducts";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const metadata = {
  title: "Fashion E-commerce",
  description: "A modern fashion e-commerce website",
};

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <Toaster position="top-right" />
        <body className={`font-sans scrollbar-hide`}>
          <ReactQueryProvider>
            <Navbar />
            <main className="flex flex-col min-h-[calc(100vh-2.5rem-1px)] pt-[104.8px]">
              <div className="flex flex-1 flex-col h-full">{children}</div>
              <Footer />
            </main>
            <Product />
            <Category />
          </ReactQueryProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
