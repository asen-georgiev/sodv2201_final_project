import { useState } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStats from '@/components/admin/AdminStats'
import AdminFilters from '@/components/admin/AdminFilters'
import useData from '@/hooks/useData'
import UsersTable from '@/components/admin/UsersTable'
import type { User } from '@/types/user'
import EditUserDialog from '@/components/admin/EditUserDialog'

const roleOptions = [
    { label: 'All roles', value: 'all' },
    { label: 'Customers', value: 'customer' },
    { label: 'Administrators', value: 'admin' },
]

export function UsersPage() {
    const { users,orders,setUsers } = useData()
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('all')
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const stats = [
        {
            label: 'Customers',
            value: users.filter(user => user.role === 'customer').length,
        },
        {
            label: 'Administrators',
            value: users.filter(user => user.role === 'admin').length,
        },
        {
            label: 'Total accounts',
            value: users.length,
        },
    ]

    const searchTerm = search.trim().toLowerCase()

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)

        const matchesRole =
            role === 'all' || user.role === role

        return matchesSearch && matchesRole
    })

    function handleEdit(user: User) {
        if (user.role === 'admin') {
            return
        }
        setEditingUser(user)
    }

    function handleEditSave(
        id: string,
        name: string,
        email: string,
    ): string | null {
        const existingUser = users.find(user => user.id === id)

        if (!existingUser || existingUser.role !== 'customer') {
            return 'This customer account cannot be edited.'
        }

        const emailExists = users.some(
            user =>
                user.id !== id &&
                user.email.trim().toLowerCase() === email,
        )

        if (emailExists) {
            return 'An account with this email already exists.'
        }

        setUsers(previousUsers =>
            previousUsers.map(user =>
                user.id === id ? { ...user, name, email } : user,
            ),
        )

        setEditingUser(null)
        return null
    }

    function handleDelete(user: User) {
        if (user.role === 'admin') {
            return
        }

        setUsers(previousUsers =>
            previousUsers.filter(existingUser => existingUser.id !== user.id),
        )
    }

    return (
        <>
            <AdminPageHeader
                title="Users"
                description="Manage customer accounts and view account roles."
            />

            <AdminStats items={stats} />

            <AdminFilters
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search name or email…"
                filter={role}
                onFilterChange={setRole}
                filterLabel="Filter by user role"
                filterOptions={roleOptions}
                resultCount={filteredUsers.length}
            />

            <UsersTable
                users={filteredUsers}
                orders={orders}
                totalUsers={users.length}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {editingUser && (
                <EditUserDialog
                    key={editingUser.id}
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleEditSave}
                />
            )}
        </>
    )
}
