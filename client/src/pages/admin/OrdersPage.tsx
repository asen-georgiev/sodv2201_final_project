import { useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStats from '@/components/admin/AdminStats'
import AdminFilters from '@/components/admin/AdminFilters'
import useData from '@/hooks/useData'
import OrdersTable from '@/components/admin/OrdersTable'
import type { OrderStatus } from '@/types/order'

const statusOptions = [
    { label: 'All statuses', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Finished', value: 'finished' },
]

export function OrdersPage() {
    const { orders, setOrders, users } = useData()
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')

    const stats = [
        {
            label: 'Total orders',
            value: orders.length,
        },
        {
            label: 'Pending',
            value: orders.filter(order => order.status === 'pending').length,
        },
        {
            label: 'Finished',
            value: orders.filter(order => order.status === 'finished').length,
        },
    ]

    const searchTerm = search.trim().toLowerCase()

    const filteredOrders = orders.filter(order => {
        const customer = users.find(user => user.id === order.userId)

        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm) ||
            (customer?.name.toLowerCase().includes(searchTerm) ?? false) ||
            (customer?.email.toLowerCase().includes(searchTerm) ?? false)

        const matchesStatus =
            status === 'all' || order.status === status

        return matchesSearch && matchesStatus
    })

    function handleStatusChange(id: string, status: OrderStatus) {
        setOrders(previousOrders =>
            previousOrders.map(order =>
                order.id === id ? { ...order, status } : order,
            ),
        )
    }

    return (
        <>
            <AdminPageHeader
                title="Orders"
                description="Submitted orders in one list. Mark them finished when fulfilled."
            />

            <AdminStats items={stats} />

            <AdminFilters
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search orders or customers…"
                filter={status}
                onFilterChange={setStatus}
                filterLabel="Filter by order status"
                filterOptions={statusOptions}
                resultCount={filteredOrders.length}
            />

            <OrdersTable
                orders={filteredOrders}
                users={users}
                totalOrders={orders.length}
                onStatusChange={handleStatusChange}
            />
        </>
    )
}
