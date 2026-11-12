import type {Order} from '@/types/order'
import {Badge} from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface OrderHistoryProps {
    orders: Order[]
}

export default function OrderHistory({orders}: OrderHistoryProps) {
    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight">
                    My orders
                </CardTitle>
            </CardHeader>

            <CardContent>
                {orders.length === 0 ? (
                    <p className="py-8 text-center text-stone-600">
                        You have not placed any orders yet.
                    </p>
                ) : (
                    <ul className="divide-y divide-stone-200">
                        {orders.map(order => {
                            const isFinished = order.status === 'finished'

                            return (
                                <li
                                    key={order.id}
                                    className="flex flex-wrap items-start justify-between gap-4 py-5"
                                >
                                    <div>
                                        <p className="font-semibold text-stone-900">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>

                                        <p className="mt-1 text-xs capitalize text-stone-500">
                                            {order.fulfillmentType}
                                        </p>

                                        <ul className="mt-2 space-y-1 text-sm text-stone-600">
                                            {order.items.map(item => (
                                                <li key={item.menuItemId}>
                                                    {item.quantity} × {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="text-right">
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

                                        <p className="mt-2 font-bold tabular-nums text-stone-900">
                                            ${order.total.toFixed(2)}
                                        </p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
