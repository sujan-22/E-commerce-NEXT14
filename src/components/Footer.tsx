import MaxWidthWrapper from "./MaxWidthWrapper";

const Footer = () => {
    return (
        <MaxWidthWrapper>
            <footer className="">
                <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                    <div>
                        <p className=" text-3xl mb-4">DIGI</p>
                        <p className="w-full md:w-2/3 text-gray-600">
                            DIGI is your go-to platform for premium products,
                            where excellence in customer service meets
                            world-class quality. Our diverse selection of
                            carefully curated items ensures that you find
                            exactly what you need.
                        </p>
                    </div>
                    <div>
                        <p className="text-md font-medium sm:mb-4 lg:mb-8">
                            COMPANY
                        </p>
                        <ul className="flex flex-col text-gray-600">
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
                        <ul className="flex flex-col text-gray-600">
                            <li>+1-000-000-0000</li>
                            <li>digi@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 mt-8 py-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} DIGI, Inc. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </MaxWidthWrapper>
    );
};

export default Footer;
