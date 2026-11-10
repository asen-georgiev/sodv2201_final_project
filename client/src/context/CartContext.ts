import { createContext } from 'react'
import type { CartItem } from '@/types/cart'

interface CartContextValue {
    cart: CartItem[]
    addItem: (menuItemId: string) => void
    updateQuantity: (menuItemId: string, quantity: number) => void
    removeItem: (menuItemId: string) => void
    clearCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(
    undefined,
)
