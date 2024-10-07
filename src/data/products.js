const products = {
    products: [
        {
            id: 1,
            name: "Baby Cap",
            category: "Baby Clothing",
            price: 9.99,
            description: "Soft and comfortable baby cap.",
            availableColors: [
                {
                    color: "Black",
                    images: ["/assets/product_images/baby-cap-black.png"],
                },
                {
                    color: "Gray",
                    images: ["/assets/product_images/baby-cap-gray.png"],
                },
                {
                    color: "White",
                    images: ["/assets/product_images/baby-cap-white.png"],
                },
            ],
            availableSizes: ["S", "M", "L"],
            stock: 75,
            onSale: true,
            newPrice: 6.99,
        },
        {
            id: 2,
            name: "Baby Onesie",
            category: "Baby Clothing",
            price: 19.99,
            description: "Cozy onesie for babies, soft and stylish.",
            availableColors: [
                {
                    color: "Beige",
                    images: [
                        "/assets/product_images/baby-onesie-beige-1.png",
                        "/assets/product_images/baby-onesie-beige-2.png",
                    ],
                },
                {
                    color: "Black",
                    images: [
                        "/assets/product_images/baby-onesie-black-1.png",
                        "/assets/product_images/baby-onesie-black-2.png",
                    ],
                },
                {
                    color: "White",
                    images: [
                        "/assets/product_images/baby-onesie-white-1.png",
                        "/assets/product_images/baby-onesie-white-2.png",
                    ],
                },
            ],
            availableSizes: ["S", "M", "L"],
            stock: 37,
        },
        {
            id: 3,
            name: "Bag",
            category: "Accessories",
            price: 24.99,
            description: "Durable bag for everyday use.",
            availableColors: [
                {
                    color: "Black",
                    images: ["/assets/product_images/bag-black.png"],
                },
                {
                    color: "White",
                    images: ["/assets/product_images/bag-white.png"],
                },
            ],
            stock: 100,
        },
        {
            id: 4,
            name: "Bomber Jacket",
            category: "Outerwear",
            price: 49.99,
            description: "Stylish bomber jacket for all seasons.",
            availableColors: [
                {
                    color: "Army",
                    images: ["/assets/product_images/bomber-jacket-army.png"],
                },
                {
                    color: "Black",
                    images: ["/assets/product_images/bomber-jacket-black.png"],
                },
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 50,
            onSale: true,
            newPrice: 41.99,
        },
        {
            id: 5,
            name: "Cowboy Hat",
            category: "Accessories",
            price: 34.99,
            description: "Classic cowboy hat for outdoor adventures.",
            availableColors: [
                {
                    color: "Black",
                    images: [
                        "/assets/product_images/cowboy-hat-black-1.png",
                        "/assets/product_images/cowboy-hat-black-2.png",
                        "/assets/product_images/cowboy-hat-black-3.png",
                        "/assets/product_images/cowboy-hat-black-4.png",
                        "/assets/product_images/cowboy-hat-black-5.png",
                        "/assets/product_images/cowboy-hat-black-6.png",
                    ],
                },
                {
                    color: "Tan",
                    images: [
                        "/assets/product_images/cowboy-hat-tan-1.png",
                        "/assets/product_images/cowboy-hat-tan-2.png",
                        "/assets/product_images/cowboy-hat-tan-3.png",
                        "/assets/product_images/cowboy-hat-tan-4.png",
                        "/assets/product_images/cowboy-hat-tan-5.png",
                        "/assets/product_images/cowboy-hat-tan-6.png",
                    ],
                },
            ],
            availableSizes: ["S", "M", "L"],
            stock: 40,
        },
        {
            id: 6,
            name: "Cup",
            category: "Accessories",
            price: 14.99,
            description: "Classic cup for coffee lovers.",
            availableColors: [
                {
                    color: "Black",
                    images: ["/assets/product_images/cup-black.png"],
                },
                {
                    color: "White",
                    images: ["/assets/product_images/cup-white.png"],
                },
            ],
            stock: 200,
            newCollection: true,
        },
        {
            id: 7,
            name: "Dog Sweater",
            category: "Pet Clothing",
            price: 19.99,
            description: "Warm and cozy sweater for your dog.",
            availableColors: [
                {
                    color: "Gray",
                    images: [
                        "/assets/product_images/dog-sweater-1.png",
                        "/assets/product_images/dog-sweater-2.png",
                    ],
                },
            ],
            availableSizes: ["S", "M", "L"],
            stock: 60,
        },
        {
            id: 8,
            name: "Hat",
            category: "Accessories",
            price: 15.99,
            description: "A trendy hat for everyday use.",
            availableColors: [
                {
                    color: "Black",
                    images: [
                        "/assets/product_images/hat-1.png",
                        "/assets/product_images/hat-2.png",
                        "/assets/product_images/hat-3.png",
                    ],
                },
            ],
            availableSizes: ["S", "M", "L"],
            stock: 80,
            newCollection: true,
        },
        {
            id: 9,
            name: "Hoodie",
            category: "Outerwear",
            price: 39.99,
            description: "Comfortable hoodie for casual wear.",
            availableColors: [
                {
                    color: "Black",
                    images: [
                        "/assets/product_images/hoodie-1.png",
                        "/assets/product_images/hoodie-2.png",
                    ],
                },
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 120,
            isWeeklyDrop: true,
            newCollection: true,
        },
        {
            id: 10,
            name: "T-shirt Circles",
            category: "T-Shirts",
            price: 24.99,
            description: "Trendy t-shirt with circular designs.",
            availableColors: [
                {
                    color: "Black",
                    images: [
                        "/assets/product_images/t-shirt-circles-black.png",
                    ],
                },
                {
                    color: "Blue",
                    images: ["/assets/product_images/t-shirt-circles-blue.png"],
                },
                {
                    color: "White",
                    images: [
                        "/assets/product_images/t-shirt-circles-white.png",
                    ],
                },
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 100,
        },
        {
            id: 11,
            name: "T-shirt Color",
            category: "T-Shirts",
            price: 22.99,
            description: "Colorful t-shirt in multiple shades.",
            availableColors: [
                {
                    color: "Black",
                    images: ["/assets/product_images/t-shirt-color-black.png"],
                },
                {
                    color: "Blue",
                    images: ["/assets/product_images/t-shirt-color-blue.png"],
                },
                {
                    color: "Gray",
                    images: ["/assets/product_images/t-shirt-color-gray.png"],
                },
                {
                    color: "Pink",
                    images: ["/assets/product_images/t-shirt-color-pink.png"],
                },
                {
                    color: "White",
                    images: ["/assets/product_images/t-shirt-color-white.png"],
                },
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 100,
            onSale: true,
            newPrice: 19.99,
            isWeeklyDrop: true,
        },
        {
            id: 12,
            name: "T-shirt Spiral",
            category: "T-Shirts",
            price: 25.99,
            description: "Unique spiral design t-shirt.",
            availableColors: [
                {
                    color: "Black",
                    images: [
                        "/assets/product_images/t-shirt-spiral-1.png",
                        "/assets/product_images/t-shirt-spiral-2.png",
                        "/assets/product_images/t-shirt-spiral-3.png",
                        "/assets/product_images/t-shirt-spiral-4.png",
                    ],
                },
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 70,
        },
        {
            id: 13,
            name: "Webcam Cover",
            category: "Accessories",
            price: 4.99,
            description: "Simple and effective webcam cover.",
            availableColors: [
                {
                    color: "Black",
                    images: ["/assets/product_images/webcam-cover.png"],
                },
            ],
            stock: 500,
            isWeeklyDrop: true,
        },
    ],
};

export default products;
