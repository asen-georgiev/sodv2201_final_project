import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

export default function RequireAdmin() {
    const { currentUser } = useAuth()

    if (!currentUser) {
        return <Navigate to="/login" replace />
    }

    if (currentUser.role !== 'admin') {
        return <Navigate to="/account" replace />
    }

    return <Outlet />
}
