export type Country = {
    label: string;
    route: string;
};

export const Countries = [
    {
        label: "USA",
        route: "us",
    },
    {
        label: "Canada",
        route: "ca",
    },
];

export enum Currency {
    "us" = "USD",
    "ca" = "CAD",
}
