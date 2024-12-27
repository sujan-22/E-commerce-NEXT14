export const metadata = {
    title: "Polaris | Cart",
};

export default function CartLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full relative small:min-h-screen">
            <div className="relative">{children}</div>
        </div>
    );
}
