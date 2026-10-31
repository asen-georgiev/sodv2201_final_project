import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { MenuItem } from '@/types/menu'
import type { MockUser } from '@/types/user'
import type { Order } from '@/types/order'
import type { Reservation } from '@/types/reservation'

interface DataContextValue {
    menu: MenuItem[]
    setMenu: Dispatch<SetStateAction<MenuItem[]>>

    users: MockUser[]
    setUsers: Dispatch<SetStateAction<MockUser[]>>

    orders: Order[]
    setOrders: Dispatch<SetStateAction<Order[]>>

    reservations: Reservation[]
    setReservations: Dispatch<SetStateAction<Reservation[]>>
}

export const DataContext = createContext<DataContextValue | undefined>(
    undefined,
)
