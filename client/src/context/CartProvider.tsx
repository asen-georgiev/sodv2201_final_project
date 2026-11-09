import type { ReactNode } from 'react'
import { CartContext } from './CartContext'
import useAuth from '@/hooks/useAuth'
import useData from '@/hooks/useData'
import useLocalStorage from '@/hooks/useLocalStorage'
import cartsData from '@/data/carts.json'
import type { CartsByUser } from '@/types/cart'

interface CartProviderProps {
    children: ReactNode
}

export default function CartProvider({ children }: CartProviderProps) {
    const { currentUser } = useAuth()
    const { menu } = useData()

    const [carts, setCarts] = useLocalStorage<CartsByUser>(
        'carts',
        cartsData as CartsByUser,
    )

    const customerId =
        currentUser?.role === 'customer' ? currentUser.id : null

    const cart = customerId ? carts[customerId] ?? [] : []

    function addItem(menuItemId: string) {
        if (!customerId) return

        const dish = menu.find(item => item.id === menuItemId)

        if (!dish || !dish.isAvailable) return

        setCarts(previousCarts => {
            const customerCart = previousCarts[customerId] ?? []

            const alreadyInCart = customerCart.some(
                item => item.menuItemId === menuItemId,
            )

            const updatedCart = alreadyInCart
                ? customerCart.map(item =>
                    item.menuItemId === menuItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                )
                : [...customerCart, { menuItemId, quantity: 1 }]

            return {
                ...previousCarts,
                [customerId]: updatedCart,
            }
        })
    }

    function updateQuantity(menuItemId: string, quantity: number) {
        if (!customerId) return

        if (!Number.isInteger(quantity) || quantity < 0) return

        if (quantity === 0) {
            removeItem(menuItemId)
            return
        }

        setCarts(previousCarts => ({
            ...previousCarts,
            [customerId]: (previousCarts[customerId] ?? []).map(item =>
                item.menuItemId === menuItemId
                    ? { ...item, quantity }
                    : item,
            ),
        }))
    }

    function removeItem(menuItemId: string) {
        if (!customerId) return

        setCarts(previousCarts => ({
            ...previousCarts,
            [customerId]: (previousCarts[customerId] ?? []).filter(
                item => item.menuItemId !== menuItemId,
            ),
        }))
    }

    function clearCart() {
        if (!customerId) return

        setCarts(previousCarts => ({
            ...previousCarts,
            [customerId]: [],
        }))
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addItem,
                updateQuantity,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
