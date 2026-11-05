import { Routes, Route } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthPage from '@/pages/AuthPage'
import { MenuItemsPage } from '@/pages/admin/MenuItemsPage'
import {OrdersPage} from "@/pages/admin/OrdersPage.tsx";

export default function App() {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path="/login" element={<AuthPage />} />

                {/* Add other customer routes here */}
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
                <Route path="menu" element={<MenuItemsPage />} />
                <Route path="orders" element={<OrdersPage />} />

                {/* Add other admin routes here */}
            </Route>
        </Routes>
    )
}
