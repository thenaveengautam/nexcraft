import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:ml-64">
        <Topbar />
        <main className="p-4 lg:p-8 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
