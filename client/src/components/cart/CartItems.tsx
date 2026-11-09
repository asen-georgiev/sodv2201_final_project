import {Minus, Plus} from 'lucide-react'
import type {CartDisplayItem} from '@/types/cart'
import {Button} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface CartItemsProps {
    items: CartDisplayItem[]
    onQuantityChange: (menuItemId: string, quantity: number) => void
    onRemove: (menuItemId: string) => void
}

export default function CartItems({items, onQuantityChange, onRemove,}: CartItemsProps) {
    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight">
                    Your items
                </CardTitle>
            </CardHeader>

            <CardContent>
                {items.length === 0 ? (
                    <p className="py-8 text-center text-stone-600">
                        Your cart is empty.
                    </p>
                ) : (
                    <ul className="divide-y divide-stone-200">
                        {items.map(item => (
                            <li
                                key={item.menuItemId}
                                className="flex flex-wrap items-center gap-4 py-5"
                            >
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt=""
                                        className="size-20 shrink-0 rounded-lg bg-stone-100 object-contain"
                                    />
                                ) : (
                                    <div
                                        aria-hidden="true"
                                        className="size-20 shrink-0 rounded-lg bg-stone-100"
                                    />
                                )}

                                <div className="min-w-0 flex-1">
                                    <h2 className="font-semibold text-stone-900">
                                        {item.name}
                                    </h2>

                                    <p className="mt-2 text-sm text-stone-600">
                                        ${item.price.toFixed(2)} each
                                    </p>

                                    {!item.isAvailable && (
                                        <p className="mt-2 text-xs text-red-700">
                                            Currently unavailable. Remove this item to checkout.
                                        </p>
                                    )}

                                    <div className="mt-3 flex flex-wrap items-center gap-3">
                                        <div className="inline-flex items-center rounded-md border border-stone-200">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                onClick={() =>
                                                    onQuantityChange(
                                                        item.menuItemId,
                                                        item.quantity - 1,
                                                    )
                                                }
                                                aria-label={`Decrease quantity of ${item.name}`}
                                            >
                                                <Minus className="size-3"/>
                                            </Button>

                                            <span
                                                aria-live="polite"
                                                className="min-w-6 text-center text-sm tabular-nums"
                                            >
                                                {item.quantity}
                                            </span>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-8"
                                                disabled={!item.isAvailable}
                                                onClick={() =>
                                                    onQuantityChange(
                                                        item.menuItemId,
                                                        item.quantity + 1,
                                                    )
                                                }
                                                aria-label={`Increase quantity of ${item.name}`}
                                            >
                                                <Plus className="size-3"/>
                                            </Button>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="link"
                                            className="h-auto p-0 text-xs text-stone-500 underline hover:text-red-700"
                                            onClick={() => onRemove(item.menuItemId)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                <p className="ml-auto font-bold tabular-nums text-stone-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
