import { NavLink, useNavigate } from 'react-router-dom'
import {
    ArrowRight,
    CalendarDays,
    LogOut,
    ShoppingBag,
    Users,
    Utensils,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/useAuth'

const navigation = [
    {
        label: 'Menu items',
        to: '/admin/menu',
        icon: Utensils,
    },
    {
        label: 'Orders',
        to: '/admin/orders',
        icon: ShoppingBag,
    },
    {
        label: 'Reservations',
        to: '/admin/reservations',
        icon: CalendarDays,
    },
    {
        label: 'Users',
        to: '/admin/users',
        icon: Users,
    },
]

export default function AdminSidebar() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <aside className="flex flex-col bg-emerald-950 px-5 py-7 text-white md:w-60 md:shrink-0">
            <NavLink to="/admin/menu" aria-label="Table and Thyme admin">
                <img
                    src="/images/brand/logo-light.svg"
                    alt="Table & Thyme"
                    className="h-9 w-auto max-w-full"
                />
            </NavLink>

            <p className="mb-4 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.125em] text-emerald-200/70">
                Restaurant management
            </p>

            <nav
                aria-label="Admin navigation"
                className="flex flex-wrap gap-2 md:flex-col"
            >
                {navigation.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                                isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-emerald-100/75 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <Icon className="size-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-8 flex flex-col gap-2 md:mt-auto md:pt-16">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-emerald-100/75 hover:bg-white/5 hover:text-white"
                >
                    <ArrowRight className="size-5" />
                    View restaurant
                </NavLink>

                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    className="h-auto w-full justify-start gap-3 rounded-lg px-3 py-3 text-sm font-normal text-emerald-100/75 hover:bg-white/5 hover:text-white"
                >
                    <LogOut className="size-5" />
                    Sign out
                </Button>
            </div>
        </aside>
    )
}
