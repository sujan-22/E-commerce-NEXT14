import { DeleteIcon, RefreshCwIcon, StepBackIcon } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { User } from "@prisma/client";

const ProductTabs = ({ seller }: { seller: User | undefined }) => {
    const tabs = [
        {
            label: "Product Information",
            component: <ProductInfoTab seller={seller} />,
        },
        {
            label: "Shipping & Returns",
            component: <ShippingInfoTab />,
        },
    ];

    return (
        <div className="w-full">
            <Accordion type="multiple">
                {tabs.map((tab, i) => (
                    <AccordionItem key={i} value={tab.label}>
                        <AccordionTrigger>{tab.label}</AccordionTrigger>
                        <AccordionContent>{tab.component}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

const ProductInfoTab = ({ seller }: { seller: User | undefined }) => {
    return (
        <div className="text-small-regular py-8">
            <div className="grid grid-cols-2 gap-x-8">
                <div className="flex flex-col gap-y-4">
                    <div>
                        <span className="font-semibold">Seller name</span>
                        <p>{seller?.name}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Seller email</span>
                        <p>{seller?.email}</p>
                    </div>
                    <div>
                        <span className="font-semibold">Material</span>
                        <p>-</p>
                    </div>
                    <div>
                        <span className="font-semibold">Country of origin</span>
                        <p>-</p>
                    </div>
                    <div>
                        <span className="font-semibold">Type</span>
                        <p>-</p>
                    </div>
                </div>
                <div className="flex flex-col gap-y-4">
                    <div>
                        <span className="font-semibold">Weight</span>
                        <p>-</p>
                    </div>
                    <div>
                        <span className="font-semibold">Dimensions</span>
                        <p>-</p>
                    </div>
                </div>
            </div>
            {/* {product.tags?.length ? (
                <div>
                    <span className="font-semibold">Tags</span>
                </div>
            ) : null} */}
        </div>
    );
};

const ShippingInfoTab = () => {
    const shippingFeatures = [
        {
            icon: <DeleteIcon />,
            title: "Fast delivery",
            description:
                "Your package will arrive in 3-5 business days at your pick-up location or in the comfort of your home.",
        },
        {
            icon: <RefreshCwIcon />,
            title: "Simple exchanges",
            description:
                "Is the fit not quite right? No worries - we'll exchange your product for a new one.",
        },
        {
            icon: <StepBackIcon />,
            title: "Easy returns",
            description:
                "Just return your product and we'll refund your money. No questions asked – we'll do our best to make sure your return is hassle-free.",
        },
    ];

    return (
        <div className="py-8 text-sm max-w-[283.51px]">
            <div className="grid grid-cols-1 gap-y-8">
                {shippingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-x-2">
                        {feature.icon}
                        <div>
                            <span className="font-semibold">
                                {feature.title}
                            </span>
                            <p className="max-w-sm">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductTabs;
