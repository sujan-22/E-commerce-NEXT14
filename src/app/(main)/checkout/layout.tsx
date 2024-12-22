export default function CheckoutLayout({
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
