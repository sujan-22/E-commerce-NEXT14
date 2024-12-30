// import Link from "next/link";

import { Collection, Product, Variant } from "@prisma/client";

interface IProductInfo extends Product {
    collection: Collection;
    variants: Variant[];
}

const ProductInfo = ({ product }: { product: IProductInfo }) => {
    if (!product) {
        return;
    }

    return (
        <div id="product-info">
            <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
                {product.collection && (
                    // TODO: Uncomment this line and update the link to the collection page
                    // <Link href={`/collections/${product.collection.id}`}>
                    //     <p className="text-sm text-muted-foreground hover:text-muted-foreground">
                    //         View Collection
                    //     </p>
                    // </Link>
                    <p className="text-medium text-muted-foreground hover:text-muted-foreground cursor-pointer">
                        {product.collection.name}
                    </p>
                )}
                <h2 className="text-3xl leading-10 text-primary">
                    {product.name}
                </h2>

                <p className="text-medium text-muted-foreground">
                    {product.description}
                </p>
            </div>
        </div>
    );
};

export default ProductInfo;
