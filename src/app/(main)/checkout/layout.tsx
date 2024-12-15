export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="relative">{children}</div>
    </div>
  );
}
