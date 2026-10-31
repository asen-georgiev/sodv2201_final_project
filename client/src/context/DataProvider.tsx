import type {ReactNode} from 'react'
import {DataContext} from './DataContext'
import useLocalStorage from '@/hooks/useLocalStorage'

import menuData from '@/data/menu.json'
import usersData from '@/data/users.json'
import ordersData from '@/data/orders.json'
import reservationsData from '@/data/reservations.json'

import type {MenuItem} from '@/types/menu'
import type {MockUser} from '@/types/user'
import type {Order} from '@/types/order'
import type {Reservation} from '@/types/reservation'

interface DataProviderProps {
    children: ReactNode
}

function DataProvider({children}: DataProviderProps) {
    const [menu, setMenu] = useLocalStorage<MenuItem[]>(
        'menu',
        menuData as MenuItem[],
    )

    const [users, setUsers] = useLocalStorage<MockUser[]>(
        'users',
        usersData as MockUser[],
    )

    const [orders, setOrders] = useLocalStorage<Order[]>(
        'orders',
        ordersData as Order[],
    )

    const [reservations, setReservations] = useLocalStorage<Reservation[]>(
        'reservations',
        reservationsData as Reservation[],
    )

    return (
        <DataContext.Provider
            value={{
                menu,
                setMenu,
                users,
                setUsers,
                orders,
                setOrders,
                reservations,
                setReservations,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider
