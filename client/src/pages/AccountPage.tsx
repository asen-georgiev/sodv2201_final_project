import {NavLink} from 'react-router-dom'
import UserPageHeader from '@/components/UserPageHeader'
import AccountDetails from '@/components/account/AccountDetails'
import OrderHistory from '@/components/account/OrderHistory'
import AccountReservations from '@/components/account/AccountReservations'
import useAuth from '@/hooks/useAuth'
import useData from '@/hooks/useData'

export default function AccountPage() {
    const {currentUser} = useAuth()
    const {orders, reservations} = useData()

    // No user logged in, so we don't show any account information
    if (!currentUser) {
        return (
            <div className="py-10">
                <UserPageHeader
                    eyebrow="My account"
                    title="You are not signed in."
                    description="Sign in to see your details, orders and reservations."
                />

                <NavLink
                    to="/login"
                    className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                >
                    Sign in
                </NavLink>
            </div>
        )
    }

    // Only the orders and reservations of the logged user, newest first
    const userOrders = orders
        .filter(order => order.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const userReservations = reservations
        .filter(reservation => reservation.userId === currentUser.id)
        .sort((a, b) => b.date.localeCompare(a.date))

    return (
        <div className="py-10">
            <UserPageHeader
                eyebrow="Make yourself at home"
                title={`Hi, ${currentUser.name}.`}
                description="Your details, orders and reservations, all in one place."
            />

            <div className="grid items-start gap-7 lg:grid-cols-[1fr_2fr]">
                <AccountDetails user={currentUser}/>

                <div className="space-y-7">
                    <OrderHistory orders={userOrders}/>

                    <AccountReservations reservations={userReservations}/>
                </div>
            </div>
        </div>
    )
}
