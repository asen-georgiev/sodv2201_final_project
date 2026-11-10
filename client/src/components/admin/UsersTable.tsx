import type {User} from '@/types/user'
import type {Order} from '@/types/order'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card, CardFooter} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface UsersTableProps {
    users: User[]
    orders: Order[]
    totalUsers: number
    onEdit: (user: User) => void
    onDelete: (user: User) => void
}

export default function UsersTable({
                                       users,
                                       orders,
                                       totalUsers,
                                       onEdit,
                                       onDelete,
                                   }: UsersTableProps) {
    return (
        <Card className="gap-0 overflow-hidden rounded-xl border-stone-200 bg-white py-0 shadow-none">
            <Table>
                <TableHeader>
                    <TableRow className="bg-stone-50 hover:bg-stone-50">
                        <TableHead className="px-5 py-4">Name</TableHead>
                        <TableHead className="px-5 py-4">Email</TableHead>
                        <TableHead className="px-5 py-4">Role</TableHead>
                        <TableHead className="px-5 py-4">Orders</TableHead>
                        <TableHead className="px-5 py-4 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="px-5 py-12 text-center text-stone-500"
                            >
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map(user => {
                            const isAdmin = user.role === 'admin'

                            const orderCount = orders.filter(
                                order => order.userId === user.id,
                            ).length

                            const initials = user.name
                                .trim()
                                .split(/\s+/)
                                .slice(0, 2)
                                .map(part => part[0])
                                .join('')
                                .toUpperCase()

                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                      <span
                          aria-hidden="true"
                          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600"
                      >
                        {initials}
                      </span>
                                            <span className="font-semibold">
                                                {user.name}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        {user.email}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <Badge
                                            variant="secondary"
                                            className={
                                                isAdmin
                                                    ? 'bg-emerald-50 text-emerald-700 p-3'
                                                    : 'bg-stone-100 text-stone-600 p-3'
                                            }
                                        >
                                            {isAdmin ? 'Administrator' : 'Customer'}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        {isAdmin ? '—' : orderCount}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        {isAdmin ? (
                                            <p className="text-right text-xs text-stone-500">
                                                Pre-existing admin
                                            </p>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(user)}
                                                    aria-label={`Edit ${user.name}`}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onDelete(user)}
                                                    aria-label={`Delete ${user.name}`}
                                                    className="text-red-700 hover:bg-red-50 hover:text-red-800"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            <CardFooter className="justify-between border-t border-stone-200 px-5 py-4 text-xs text-stone-500">
        <span>
          Showing {users.length} of {totalUsers} accounts
        </span>

                <span>User management</span>
            </CardFooter>
        </Card>
    )
}
