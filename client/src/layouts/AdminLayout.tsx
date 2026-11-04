import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from "@/components/admin/AdminHeader.tsx";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-stone-100 text-stone-900 md:flex">
            <AdminSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader />
                <main className="flex-1 p-6 md:p-9">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
