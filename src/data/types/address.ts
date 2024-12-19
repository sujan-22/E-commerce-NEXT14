export interface IAddress {
    addressId?: string;
    addressName: string;
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    province: string;
    email: string;
}

export interface Region {
    label: string;
}

export interface Country {
    label: string;
    regions: Region[];
}

export const countries: Country[] = [
    {
        label: "Canada",
        regions: [
            { label: "Alberta" },
            { label: "British Columbia" },
            { label: "Manitoba" },
            { label: "New Brunswick" },
            { label: "Newfoundland and Labrador" },
            { label: "Northwest Territories" },
            { label: "Nova Scotia" },
            { label: "Ontario" },
            { label: "Prince Edward Island" },
            { label: "Quebec" },
            { label: "Saskatchewan" },
            { label: "Nunavut" },
            { label: "Yukon" },
        ],
    },
];

export default countries;

export const taxes = [
    {
        province: "Alberta",
        taxRate: "5%",
    },
    {
        province: "British Columbia",
        taxRate: "12%",
    },
    {
        province: "Manitoba",
        taxRate: "12%",
    },
    {
        province: "New Brunswick",
        taxRate: "15%",
    },
    {
        province: "Newfoundland and Labrador",
        taxRate: "15%",
    },
    {
        province: "Nova Scotia",
        taxRate: "15%",
    },
    {
        province: "Ontario",
        taxRate: "13%",
    },
    {
        province: "Prince Edward Island",
        taxRate: "15%",
    },
    {
        province: "Quebec",
        taxRate: "14.975%",
    },
    {
        province: "Saskatchewan",
        taxRate: "11%",
    },
    {
        province: "Northwest Territories",
        taxRate: "5%",
    },
    {
        province: "Nunavut",
        taxRate: "5%",
    },
    {
        province: "Yukon",
        taxRate: "5%",
    },
];
