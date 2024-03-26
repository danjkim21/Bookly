import { checkAuth } from "@/lib/auth/utils";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <main>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 pt-2 md:p-8">
          <Navbar />
          {children}
        </div>
      </div>
      <Toaster richColors />
    </main>
  );
}
