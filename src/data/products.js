const products = {
    products: [
        {
            id: 1,
            name: "Baby Cap",
            category: "Baby Clothing",
            price: 9.99,
            description: "Soft and comfortable baby cap.",
            availableColors: ["Black", "Gray", "White"],
            availableImages: [
                "/assets/product_images/baby-cap-black.png",
                "/assets/product_images/baby-cap-gray.png",
                "/assets/product_images/baby-cap-white.png",
            ],
            availableSizes: ["S", "M", "L"],
            stock: 75,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {
                    type: "On Sale",
                    title: "Discounted Products",
                    description:
                        "Grab these amazing deals before they're gone!",
                    newPrice: 6.99,
                },
            },
        },
        {
            id: 2,
            name: "Baby Onesie",
            category: "Baby Clothing",
            price: 19.99,
            description: "Cozy onesie for babies, soft and stylish.",
            availableColors: ["Beige", "Black", "White"],
            availableImages: [
                "/assets/product_images/baby-onesie-beige-1.png",
                "/assets/product_images/baby-onesie-beige-2.png",
                "/assets/product_images/baby-onesie-black-1.png",
                "/assets/product_images/baby-onesie-black-2.png",
                "/assets/product_images/baby-onesie-white-1.png",
                "/assets/product_images/baby-onesie-white-2.png",
            ],
            availableSizes: ["S", "M", "L"],
            stock: 37,
            collection: {
                winter: {
                    type: "Winter",
                    title: "Winter Collection",
                    description: "Cozy, warm clothing for the chilly season.",
                },
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 3,
            name: "Bag",
            category: "Accessories",
            price: 24.99,
            description: "Durable bag for everyday use.",
            availableColors: ["Black", "White"],
            availableImages: [
                "/assets/product_images/bag-black.png",
                "/assets/product_images/bag-white.png",
            ],
            availableSizes: ["S", "M", "L"],
            stock: 100,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {
                    type: "On Sale",
                    title: "Discounted Products",
                    description:
                        "Grab these amazing deals before they're gone!",
                    newPrice: 21.99,
                },
            },
        },
        {
            id: 4,
            name: "Bomber Jacket",
            category: "Outerwear",
            price: 49.99,
            description: "Stylish bomber jacket for all seasons.",
            availableColors: ["Army", "Black"],
            availableImages: [
                "/assets/product_images/bomber-jacket-army.png",
                "/assets/product_images/bomber-jacket-black.png",
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 50,
            collection: {
                winter: {
                    type: "Winter",
                    title: "Winter Collection",
                    description: "Cozy, warm clothing for the chilly season.",
                },
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 5,
            name: "Cowboy Hat",
            category: "Accessories",
            price: 34.99,
            description: "Classic cowboy hat for outdoor adventures.",
            availableColors: ["Black", "Tan"], // Simplified colors
            availableImages: [
                "/assets/product_images/cowboy-hat-black-1.png",
                "/assets/product_images/cowboy-hat-black-2.png",
                "/assets/product_images/cowboy-hat-black-3.png",
                "/assets/product_images/cowboy-hat-tan-1.png",
                "/assets/product_images/cowboy-hat-tan-2.png",
            ],
            availableSizes: ["S", "M", "L"],
            stock: 40,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 6,
            name: "Cup",
            category: "Accessories",
            price: 14.99,
            description: "Classic cup for coffee lovers.",
            availableColors: ["Black", "White"], // Simplified colors
            availableImages: [
                "/assets/product_images/cup-black.png",
                "/assets/product_images/cup-white.png",
            ],
            availableSizes: ["S", "M", "L"],
            stock: 200,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 7,
            name: "Dog Sweater",
            category: "Pet Clothing",
            price: 19.99,
            description: "Warm and cozy sweater for your dog.",
            availableColors: ["Gray"], // Simplified colors
            availableImages: [
                "/assets/product_images/dog-sweater-1.png",
                "/assets/product_images/dog-sweater-2.png",
            ],
            availableSizes: ["S", "M", "L"],
            stock: 60,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 8,
            name: "Hat",
            category: "Accessories",
            price: 15.99,
            description: "A trendy hat for everyday use.",
            availableColors: ["Black"], // Simplified colors
            availableImages: [
                "/assets/product_images/hat-1.png",
                "/assets/product_images/hat-2.png",
            ],
            availableSizes: ["S", "M", "L"],
            stock: 80,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 9,
            name: "Hoodie",
            category: "Outerwear",
            price: 39.99,
            description: "Comfortable hoodie for casual wear.",
            availableColors: ["Black"], // Simplified colors
            availableImages: [
                "/assets/product_images/hoodie-1.png",
                "/assets/product_images/hoodie-2.png",
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 120,
            collection: {
                winter: {
                    type: "Winter",
                    title: "Winter Collection",
                    description: "Cozy, warm clothing for the chilly season.",
                },
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 10,
            name: "T-shirt Circles",
            category: "T-Shirts",
            price: 24.99,
            description: "Trendy t-shirt with circular designs.",
            availableColors: ["Black", "Blue", "White"], // Simplified colors
            availableImages: [
                "/assets/product_images/t-shirt-circles-black.png",
                "/assets/product_images/t-shirt-circles-blue.png",
                "/assets/product_images/t-shirt-circles-white.png",
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 100,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {},
            },
        },
        {
            id: 11,
            name: "T-shirt Color",
            category: "T-Shirts",
            price: 22.99,
            description: "Colorful t-shirt in multiple shades.",
            availableColors: ["Black", "Blue", "Gray", "Pink", "White"], // Simplified colors
            availableImages: [
                "/assets/product_images/t-shirt-color-black.png",
                "/assets/product_images/t-shirt-color-blue.png",
                "/assets/product_images/t-shirt-color-gray.png",
                "/assets/product_images/t-shirt-color-pink.png",
                "/assets/product_images/t-shirt-color-white.png",
            ],
            availableSizes: ["S", "M", "L", "XL"],
            stock: 200,
            collection: {
                winter: {},
                summer: {},
                spring: {},
                onsale: {
                    type: "On Sale",
                    title: "Discounted Products",
                    description:
                        "Grab these amazing deals before they're gone!",
                    newPrice: 19.99,
                },
            },
        },
    ],
};

export default products;
