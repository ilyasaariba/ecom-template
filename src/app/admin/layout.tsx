export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen font-cairo text-slate-800" dir="rtl">
      {children}
    </div>
  );
}
