export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-[#f4f6f9]">
      {children}
    </div>
  );
}
