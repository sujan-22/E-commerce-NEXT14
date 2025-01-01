import MaxWidthWrapper from "@/components/utility/MaxWidthWrapper";
import ProductList from "@/components/product/ProductList";
import FilterSidebar from "@/components/product/all-products/FilterSidebar";
import SortSidebar from "@/components/product/all-products/SortSidebar";
import { Product } from "@prisma/client";

const Categories = ({
    products,
    isMobileView,
}: {
    products: Product[];
    isMobileView: boolean;
}) => {
    return (
        <MaxWidthWrapper>
            {/* Main layout container */}
            <div
                className={`flex w-full ${
                    isMobileView ? "flex-col" : "justify-between"
                }`}
            >
                {/* Mobile dropdowns for Filter and Sort */}
                {isMobileView && (
                    <div className="my-4 flex flex-col gap-4 w-full">
                        {/* Render FilterSidebar as dropdown */}
                        <FilterSidebar mobileView={isMobileView} />

                        {/* Render SortSidebar as dropdown */}
                        <SortSidebar mobileView={isMobileView} />
                    </div>
                )}

                {/* Left Sidebar - Categories (hidden on mobile) */}
                {!isMobileView && <FilterSidebar mobileView={isMobileView} />}

                {/* Main Content - Products */}
                <div className={`w-full ${isMobileView ? "" : "w-[80%]"}`}>
                    {products && (
                        <ProductList products={products} size={"full"} />
                    )}
                </div>

                {/* Right Sidebar - Sorting (hidden on mobile) */}
                {!isMobileView && <SortSidebar mobileView={isMobileView} />}
            </div>
        </MaxWidthWrapper>
    );
};

export default Categories;
