export interface ICollectionData {
    type: "Winter" | "Summer" | "Spring" | "On Sale";
    title: string;
    description: string;
    newPrice?: number | null;
}

export interface ISizesData {
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "Regular";
}

export interface ICollections {
    winter: ICollectionData;
    summer: ICollectionData;
    spring: ICollectionData;
    onsale: ICollectionData;
}

export interface IColorsData {
    color:
        | "Beige"
        | "Black"
        | "Blue"
        | "Brown"
        | "Gray"
        | "Green"
        | "Navy"
        | "Purple"
        | "Red"
        | "White"
        | "Pink";
}

export const COLLECTION_DATA: ICollections = {
    winter: {
        type: "Winter",
        title: "Winter Collection",
        description: "Cozy, warm clothing for the chilly season.",
    },
    summer: {
        type: "Summer",
        title: "Summer Collection",
        description: "Light and breezy clothes for sunny days.",
    },
    spring: {
        type: "Spring",
        title: "Spring Collection",
        description: "Fresh and colorful clothing for the new season.",
    },
    onsale: {
        type: "On Sale",
        title: "Discounted Products",
        description: "Grab these amazing deals before they're gone!",
        newPrice: null,
    },
};

export const SIZES: ISizesData[] = [
    { size: "XS" },
    { size: "S" },
    { size: "M" },
    { size: "L" },
    { size: "XL" },
    { size: "XXL" },
    { size: "Regular" },
];

export const COLORS: IColorsData[] = [
    { color: "Beige" },
    { color: "Black" },
    { color: "Blue" },
    { color: "Brown" },
    { color: "Gray" },
    { color: "Green" },
    { color: "Navy" },
    { color: "Pink" },
    { color: "Purple" },
    { color: "Red" },
    { color: "White" },
];
