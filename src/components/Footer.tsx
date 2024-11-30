import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";

const Footer = () => {
    return (
        <MaxWidthWrapper>
            <footer className="">
                <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                    <div>
                        <Image
                            src={"/assets/light-logo.png"}
                            alt="logo"
                            width={60}
                            height={50}
                        />
                        <p className="w-full md:w-2/3 text-muted-foreground">
                            AURA (Art of Uniqueness, Refined Aesthetics) is your
                            go-to platform for premium products, where
                            excellence in customer service meets world-class
                            quality. Our diverse selection of carefully curated
                            items ensures that you find exactly what you need.
                        </p>
                    </div>
                    <div>
                        <p className="text-md font-medium sm:mb-4 lg:mb-8">
                            COMPANY
                        </p>
                        <ul className="flex flex-col text-muted-foreground">
                            <li>Home</li>
                            <li>About us</li>
                            <li>Delivery</li>
                            <li>Privacy policy</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-md font-medium sm:mb-4 lg:mb-8">
                            GET IN TOUCH
                        </p>
                        <ul className="flex flex-col text-muted-foreground">
                            <li>+1-000-000-0000</li>
                            <li>aura@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 py-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} AURA, Inc. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </MaxWidthWrapper>
    );
};

export default Footer;
