// pages/products/[productId]/page.js
import useStore from "@/context/useStore";
import Product from "./Product";

export async function generateMetadata({ params }) {
    const productId = params.productId;

    // Fetch products dynamically or use context/store
    const products = useStore.getState().allProducts;
    const product = products.find((prod) => prod.id === parseInt(productId));

    return {
        title: product ? `Polaris | ${product.name}` : "Polaris | Product",
        description: product
            ? `Explore ${product.name}, a premium product in the ${product.category} category.`
            : "Explore our range of products.",
    };
}

const Page = ({ params }) => {
    return <Product params={params} />;
};

export default Page;
