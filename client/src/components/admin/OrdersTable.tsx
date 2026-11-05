import type {Order, OrderStatus} from '@/types/order'
import type {User} from '@/types/user'
import {Badge} from '@/components/ui/badge'
import {Card, CardFooter} from '@/components/ui/card'
import {Switch} from '@/components/ui/switch'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface OrdersTableProps {
    orders: Order[]
    users: User[]
    totalOrders: number
    onStatusChange: (id: string, status: OrderStatus) => void
}

export default function OrdersTable({orders, users, totalOrders, onStatusChange,}: OrdersTableProps) {
    return (
        <Card className="gap-0 overflow-hidden rounded-xl border-stone-200 bg-white py-0 shadow-none">
            <Table>
                <TableHeader>
                    <TableRow className="bg-stone-50 hover:bg-stone-50">
                        <TableHead className="px-5 py-4">Order</TableHead>
                        <TableHead className="px-5 py-4">Customer</TableHead>
                        <TableHead className="px-5 py-4">Items</TableHead>
                        <TableHead className="px-5 py-4">Type</TableHead>
                        <TableHead className="px-5 py-4">Total</TableHead>
                        <TableHead className="px-5 py-4">Finished?</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="px-5 py-12 text-center text-stone-500"
                            >
                                No orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map(order => {
                            const customer = users.find(
                                user => user.id === order.userId,
                            )

                            const isFinished = order.status === 'finished'

                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="px-5 py-4">
                                        <p className="font-semibold">
                                            #{order.id}
                                        </p>

                                        <p className="mt-1 text-xs text-stone-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <p className="font-semibold">
                                            {customer?.name ?? 'Deleted customer'}
                                        </p>

                                        <p className="mt-1 text-xs text-stone-500">
                                            {customer?.email ?? 'Account unavailable'}
                                        </p>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <ul className="space-y-1 text-sm">
                                            {order.items.map(item => (
                                                <li key={item.menuItemId}>
                                                    {item.quantity} × {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>

                                    <TableCell className="px-5 py-4 capitalize">
                                        {order.fulfillmentType}
                                    </TableCell>

                                    <TableCell className="px-5 py-4 font-semibold">
                                        ${order.total.toFixed(2)}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={isFinished}
                                                onCheckedChange={checked =>
                                                    onStatusChange(
                                                        order.id,
                                                        checked ? 'finished' : 'pending',
                                                    )
                                                }
                                                aria-label={`Mark order ${order.id} as finished`}
                                            />

                                            <Badge
                                                variant="secondary"
                                                className={
                                                    isFinished
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : 'bg-orange-50 text-orange-700'
                                                }
                                            >
                                                {isFinished ? 'Finished' : 'Pending'}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            <CardFooter className="justify-between border-t border-stone-200 px-5 py-4 text-xs text-stone-500">
        <span>
          Showing {orders.length} of {totalOrders} orders
        </span>

                <span>Order management</span>
            </CardFooter>
        </Card>
    )
}
