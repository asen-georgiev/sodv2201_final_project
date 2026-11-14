import {useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import UserPageHeader from '@/components/UserPageHeader'
import AccountSidebar from '@/components/account/AccountSidebar'
import type {AccountTab} from '@/components/account/AccountSidebar'
import AccountOrders from '@/components/account/AccountOrders'
import AccountReservations from '@/components/account/AccountReservations'
import AccountDetailsForm from '@/components/account/AccountDetailsForm'
import type {AccountDetailsInput} from '@/components/account/AccountDetailsForm'
import EditReservationDialog from '@/components/account/EditReservationDialog'
import CancelReservationDialog from '@/components/account/CancelReservationDialog'
import useAuth from '@/hooks/useAuth'
import useData from '@/hooks/useData'
import type {Reservation} from '@/types/reservation'

export default function AccountPage() {
    const {currentUser, logout} = useAuth()
    const {orders, reservations, setReservations, users, setUsers} = useData()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<AccountTab>('orders')
    const [editingReservation, setEditingReservation] = useState(false)
    const [cancellingReservation, setCancellingReservation] = useState<Reservation | null>(null)
    const firstName = currentUser.name.split(' ')[0]

    const userOrders = orders
        .filter(order => order.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const userReservations = reservations
        .filter(reservation => reservation.userId === currentUser.id)
        .sort((a, b) => b.date.localeCompare(a.date))

    function handleSignOut() {
        logout()
        navigate('/login', {replace: true})
    }

    function handleCancelReservation(id: string) {
        setReservations(previousReservations =>
            previousReservations.filter(reservation => reservation.id !== id),
        )
        setCancellingReservation(null)
    }

    function handleSaveDetails(input: AccountDetailsInput): string {
        if (!currentUser) {
            return 'Sign in to update your details.'
        }

        const name = input.name.trim()
        const email = input.email.trim().toLowerCase()

        if (!name || !email) {
            return 'Enter your name and email address.'
        }

        const emailTaken = users.some(
            user =>
                user.id !== currentUser.id &&
                user.email.toLowerCase() === email,
        )

        if (emailTaken) {
            return 'An account with this email already exists.'
        }

        setUsers(previousUsers =>
            previousUsers.map(user =>
                user.id === currentUser.id
                    ? {...user, name, email, phone: input.phone.trim()}
                    : user,
            ),
        )

        return ''
    }

    if (!currentUser) {
        return (
            <div className="py-10">
                <UserPageHeader
                    eyebrow="Your table & thyme"
                    title="You are not signed in."
                    description="Sign in to see your orders, reservations, and account details."
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

    return (
        <div className="py-10">
            <UserPageHeader
                eyebrow="Your table & thyme"
                title={`Hello, ${firstName}.`}
                description="Your submitted orders, reservations, and account details in one place."
            />

            <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[215px_minmax(0,1fr)] md:gap-8">
                <AccountSidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onSignOut={handleSignOut}
                />

                <div>
                    {activeTab === 'orders' && (
                        <AccountOrders orders={userOrders}/>
                    )}

                    {activeTab === 'reservations' && (
                        <AccountReservations
                            reservations={userReservations}
                            onEdit={() => setEditingReservation(true)}
                            onCancel={setCancellingReservation}
                        />
                    )}

                    {activeTab === 'details' && (
                        <AccountDetailsForm
                            user={currentUser}
                            onSave={handleSaveDetails}
                        />
                    )}
                </div>
            </div>

            {editingReservation && (
                <EditReservationDialog onClose={() => setEditingReservation(false)}/>
            )}

            {cancellingReservation && (
                <CancelReservationDialog
                    reservation={cancellingReservation}
                    onConfirm={handleCancelReservation}
                    onClose={() => setCancellingReservation(null)}
                />
            )}
        </div>
    )
}
