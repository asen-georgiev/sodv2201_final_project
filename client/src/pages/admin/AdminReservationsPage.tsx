import { useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStats from '@/components/admin/AdminStats'
import AdminFilters from '@/components/admin/AdminFilters'
import useData from '@/hooks/useData'
import ReservationsTable from '@/components/admin/ReservationsTable'
import type { ReservationStatus } from '@/types/reservation'

const statusOptions = [
    { label: 'All statuses', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Finished', value: 'finished' },
]

export function AdminReservationsPage() {
    const { reservations, setReservations, users } = useData()
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')

    const stats = [
        {
            label: 'Total bookings',
            value: reservations.length,
        },
        {
            label: 'Pending',
            value: reservations.filter(
                reservation => reservation.status === 'pending',
            ).length,
        },
        {
            label: 'Finished',
            value: reservations.filter(
                reservation => reservation.status === 'finished',
            ).length,
        },
    ]

    const searchTerm = search.trim().toLowerCase()

    const filteredReservations = reservations.filter(reservation => {
        const customer = users.find(
            user => user.id === reservation.userId,
        )

        const matchesSearch =
            reservation.id.toLowerCase().includes(searchTerm) ||
            (customer?.name.toLowerCase().includes(searchTerm) ?? false) ||
            (customer?.email.toLowerCase().includes(searchTerm) ?? false) ||
            reservation.type.toLowerCase().includes(searchTerm) ||
            (reservation.eventType?.toLowerCase().includes(searchTerm) ?? false)

        const matchesStatus =
            status === 'all' || reservation.status === status

        return matchesSearch && matchesStatus
    })

    function handleStatusChange(id: string, status: ReservationStatus) {
        setReservations(previousReservations =>
            previousReservations.map(reservation =>
                reservation.id === id
                    ? { ...reservation, status }
                    : reservation,
            ),
        )
    }

    return (
        <>
            <AdminPageHeader
                title="Reservations"
                description="Table reservations and events in one list. Finish them after the visit."
            />

            <AdminStats items={stats} />

            <AdminFilters
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search guests or events…"
                filter={status}
                onFilterChange={setStatus}
                filterLabel="Filter by reservation status"
                filterOptions={statusOptions}
                resultCount={filteredReservations.length}
            />

            <ReservationsTable
                reservations={filteredReservations}
                users={users}
                totalReservations={reservations.length}
                onStatusChange={handleStatusChange}
            />
        </>
    )
}
