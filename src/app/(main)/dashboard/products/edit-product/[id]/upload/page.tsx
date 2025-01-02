// dashboard/products/edit-product/[id]/upload/page.tsx

import PageClient from "./page-client";

export default function Page({ params }: { params: { id: string } }) {
    const productId = params.id;
    return <PageClient productId={productId} />;
}
