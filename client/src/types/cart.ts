export interface CartItem {
    menuItemId: string
    quantity: number
}

export interface CartDisplayItem extends CartItem {
    name: string
    imageUrl: string
    price: number
    isAvailable: boolean
}

export type CartsByUser = Record<string, CartItem[]>
