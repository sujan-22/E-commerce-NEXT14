import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        availableColors: { type: [String], default: [] },
        availableImages: { type: [String], default: [] },
        availableSizes: { type: [String], default: [] },
        stock: { type: Number, required: true, min: 0 },
        collection: {
            winter: {
                type: {
                    type: String,
                    enum: ["Winter"],
                    default: "Winter",
                },
                title: { type: String, default: null },
                description: { type: String, default: null },
            },
            summer: {
                type: {
                    type: String,
                    enum: ["Summer"],
                    default: "Summer",
                },
                title: { type: String, default: null },
                description: { type: String, default: null },
            },
            spring: {
                type: {
                    type: String,
                    enum: ["Spring"],
                    default: "Spring",
                },
                title: { type: String, default: null },
                description: { type: String, default: null },
            },
            onsale: {
                type: {
                    type: String,
                    enum: ["On Sale"],
                    default: "On Sale",
                },
                title: { type: String, default: null },
                description: { type: String, default: null },
                newPrice: { type: Number, default: null },
            },
        },
    },
    { timestamps: true }
);

const Product =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
