export type ReservationStatus = 'pending' | 'finished'

export type ReservationType = 'table' | 'event'

export type EventType = 'birthday' | 'corporate' | 'other'

export interface Reservation {
    id: string
    userId: string
    type: ReservationType
    date: string
    time: string
    guests: number
    phone: string
    notes: string
    eventType: EventType | null
    menuPreference: string
    status: ReservationStatus
}
