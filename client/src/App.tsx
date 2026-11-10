import { Routes, Route } from 'react-router-dom'
import CustomerLayout from '@/layouts/CustomerLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthPage from '@/pages/AuthPage'
import { MenuItemsPage } from '@/pages/admin/MenuItemsPage'
import {OrdersPage} from "@/pages/admin/OrdersPage.tsx";
import {AdminReservationsPage} from "@/pages/admin/AdminReservationsPage.tsx";
import {UsersPage} from "@/pages/admin/UsersPage.tsx";
import CartPage from "@/pages/CartPage.tsx";
import ReservationsPage from '@/pages/ReservationsPage'
import RequireAdmin from '@/components/auth/RequireAdmin'

export default function App() {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Add other customer routes here */}
            </Route>

            <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="menu" element={<MenuItemsPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="reservations" element={<AdminReservationsPage />} />
                    <Route path="users" element={<UsersPage />} />
                </Route>
            </Route>
        </Routes>
    )
}
