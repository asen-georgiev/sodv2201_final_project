import { ArrowRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import UserPageHeader from '@/components/UserPageHeader'
import CartItems from '@/components/cart/CartItems'
import useCart from '@/hooks/useCart'
import useData from '@/hooks/useData'
import type { CartDisplayItem } from '@/types/cart'
import CheckoutForm from '@/components/cart/CheckoutForm'
import type { CheckoutInput } from '@/components/cart/CheckoutForm'
import useAuth from '@/hooks/useAuth'
import { useState } from 'react'
import type { Order, OrderItem } from '@/types/order'
import {Alert, AlertDescription, AlertTitle,} from '@/components/ui/alert'

export default function CartPage() {
    const { cart, updateQuantity, removeItem, clearCart } = useCart()
    const { menu, setOrders } = useData()
    const { currentUser } = useAuth()
    const [checkoutError, setCheckoutError] = useState('')
    const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

    const displayItems: CartDisplayItem[] = cart.map(cartItem => {
        const dish = menu.find(
            item => item.id === cartItem.menuItemId,
        )

        return {
            ...cartItem,
            name: dish?.name ?? 'Removed menu item',
            imageUrl: dish?.imageUrl ?? '',
            price: dish?.price ?? 0,
            isAvailable: dish?.isAvailable ?? false,
        }
    })

    const total = Number(
        displayItems
            .reduce((sum, item) => sum + item.price * item.quantity, 0)
            .toFixed(2),
    )

    const checkoutDisabled =
        displayItems.length === 0 ||
        displayItems.some(item => !item.isAvailable)

    function handleCheckout(input: CheckoutInput) {
        setCheckoutError('')

        if (!currentUser || currentUser.role !== 'customer') {
            setCheckoutError('Sign in with a customer account to checkout.')
            return
        }

        if (cart.length === 0) {
            setCheckoutError('Your cart is empty.')
            return
        }

        if (input.fulfillmentType === 'delivery' && !input.deliveryAddress.trim()
        ) {
            setCheckoutError('Enter a delivery address.')
            return
        }

        const orderItems: OrderItem[] = []

        for (const cartItem of cart) {
            const dish = menu.find(
                item => item.id === cartItem.menuItemId,
            )

            if (!dish || !dish.isAvailable) {
                setCheckoutError(
                    'Some items are no longer available. Remove them before checkout.',
                )
                return
            }

            if (!Number.isInteger(cartItem.quantity) ||
                cartItem.quantity < 1
            ) {
                setCheckoutError('Every item must have a valid positive quantity.')
                return
            }

            orderItems.push({
                menuItemId: dish.id,
                name: dish.name,
                price: dish.price,
                quantity: cartItem.quantity,
            })
        }

        const orderTotal = Number(
            orderItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2),
        )

        const newOrder: Order = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            items: orderItems,
            fulfillmentType: input.fulfillmentType,
            deliveryAddress:
                input.fulfillmentType === 'delivery'
                    ? input.deliveryAddress.trim()
                    : '',
            notes: input.notes.trim(),
            total: orderTotal,
            status: 'pending',
            createdAt: new Date().toISOString(),
        }

        setOrders(previousOrders => [...previousOrders, newOrder])
        clearCart()
        setCreatedOrder(newOrder)
    }

    return (
        <div className="py-10">
            <UserPageHeader
                eyebrow="A good meal is almost yours"
                title="Your cart."
                description="Make it your kind of meal. Review your items and choose how to enjoy them."
            />
            {checkoutError && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Could not place order</AlertTitle>
                    <AlertDescription>{checkoutError}</AlertDescription>
                </Alert>
            )}

            {createdOrder && (
                <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-900">
                    <AlertTitle>Order placed successfully</AlertTitle>
                    <AlertDescription>
                        Your ${createdOrder.total.toFixed(2)} order has been submitted.
                        You can find it in My Orders. No payment was collected.
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid items-start gap-7 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <CartItems
                        items={displayItems}
                        onQuantityChange={updateQuantity}
                        onRemove={removeItem}
                    />

                    <div className="flex justify-center">
                        <NavLink
                            to="/menu"
                            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-stone-600 hover:text-emerald-700"
                        >
                            <ArrowRight className="size-4" />
                            Continue browsing
                        </NavLink>
                    </div>
                </div>

                <div>
                    {currentUser?.role === 'customer' ? (
                        <CheckoutForm
                            customerName={currentUser.name}
                            customerEmail={currentUser.email}
                            total={total}
                            disabled={checkoutDisabled}
                            onCheckout={handleCheckout}
                        />
                    ) : (
                        <p className="text-stone-600">
                            Sign in with a customer account to checkout.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
