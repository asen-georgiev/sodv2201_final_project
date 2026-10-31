export type OrderStatus = 'pending' | 'finished'

export type FulfillmentType = 'pickup' | 'delivery'

export interface OrderItem {
    menuItemId: string
    name: string
    price: number
    quantity: number
}

export interface Order {
    id: string
    userId: string
    items: OrderItem[]
    fulfillmentType: FulfillmentType
    deliveryAddress: string
    notes: string
    total: number
    status: OrderStatus
    createdAt: string
}
