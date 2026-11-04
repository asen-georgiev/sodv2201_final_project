import { useLocation } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const pageTitles: Record<string, string> = {
    '/admin/menu': 'Menu items',
    '/admin/orders': 'Orders',
    '/admin/reservations': 'Reservations',
    '/admin/users': 'Users',
}

export default function AdminHeader() {
    const { pathname } = useLocation()
    const { currentUser } = useAuth()

    const pageTitle = pageTitles[pathname] ?? 'Dashboard'
    const name = currentUser?.name ?? 'Administrator'

    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase()

    return (
        <header className="flex min-h-20 flex-wrap items-center justify-between gap-4 border-b border-stone-200 bg-white px-6 py-4 md:px-9">
            <p className="text-sm text-stone-600">
                Restaurant workspace
                <span className="mx-3 text-stone-400">/</span>
                <span className="font-semibold text-stone-900">
          {pageTitle}
        </span>
            </p>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-stone-500">Administrator</p>
                </div>

                <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700"
                >
          {initials}
        </span>
            </div>
        </header>
    )
}
