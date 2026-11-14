import type {Order} from '@/types/order'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface AccountOrdersProps {
    orders: Order[]
}

function formatOrderDate(date: string) {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    })
}

export default function AccountOrders({orders}: AccountOrdersProps) {
    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight">
                    My orders
                </CardTitle>

                <CardDescription className="mt-3 mb-2 text-stone-600">
                    Orders you have already submitted through checkout.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {orders.length === 0 ? (
                    <p className="py-8 text-center text-stone-600">
                        You have not placed any orders yet.
                    </p>
                ) : (
                    <ul className="divide-y divide-stone-200">
                        {orders.map(order => (
                            <li
                                key={order.id}
                                className="flex items-start justify-between gap-4 py-4.5 sm:items-center"
                            >
                                <div className="min-w-0">
                                    <p className="font-bold text-stone-900">
                                        #{order.id}
                                    </p>

                                    <p className="mt-1 text-sm text-stone-600">
                                        {formatOrderDate(order.createdAt)} ·{' '}
                                        <span className="capitalize">
                                            {order.fulfillmentType}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-sm text-stone-600">
                                        {order.items
                                            .map(item => `${item.quantity} × ${item.name}`)
                                            .join(' · ')}
                                    </p>
                                </div>

                                <p className="whitespace-nowrap font-bold tabular-nums text-stone-900">
                                    ${order.total.toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
