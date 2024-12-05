export interface IAddress {
    addressId?: string;
    addressName: string;
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phone?: string;
    province: string;
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
            { label: "Yukon" },
        ],
    },
    {
        label: "United States",
        regions: [
            { label: "Alabama" },
            { label: "Alaska" },
            { label: "Arizona" },
            { label: "Arkansas" },
            { label: "California" },
            { label: "Colorado" },
            { label: "Connecticut" },
            { label: "Delaware" },
            { label: "Florida" },
            { label: "Georgia" },
            { label: "Hawaii" },
            { label: "Idaho" },
            { label: "Illinois" },
            { label: "Indiana" },
            { label: "Iowa" },
            { label: "Kansas" },
            { label: "Kentucky" },
            { label: "Louisiana" },
            { label: "Maine" },
            { label: "Maryland" },
            { label: "Massachusetts" },
            { label: "Michigan" },
            { label: "Minnesota" },
            { label: "Mississippi" },
            { label: "Missouri" },
            { label: "Montana" },
            { label: "Nebraska" },
            { label: "Nevada" },
            { label: "New Hampshire" },
            { label: "New Jersey" },
            { label: "New Mexico" },
            { label: "New York" },
            { label: "North Carolina" },
            { label: "North Dakota" },
            { label: "Ohio" },
            { label: "Oklahoma" },
            { label: "Oregon" },
            { label: "Pennsylvania" },
            { label: "Rhode Island" },
            { label: "South Carolina" },
            { label: "South Dakota" },
            { label: "Tennessee" },
            { label: "Texas" },
            { label: "Utah" },
            { label: "Vermont" },
            { label: "Virginia" },
            { label: "Washington" },
            { label: "West Virginia" },
            { label: "Wisconsin" },
            { label: "Wyoming" },
        ],
    },
];

export default countries;
