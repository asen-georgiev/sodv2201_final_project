import {NavLink} from 'react-router-dom'
import type {EventType, Reservation} from '@/types/reservation'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface AccountReservationsProps {
    reservations: Reservation[]
    onEdit: () => void
    onCancel: (reservation: Reservation) => void
}

const eventLabels: Record<EventType, string> = {
    birthday: 'Birthday event',
    corporate: 'Corporate event',
    other: 'Special event',
}

export default function AccountReservations({reservations, onEdit, onCancel}: AccountReservationsProps) {
    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader className="items-center">
                <CardTitle className="text-xl font-bold tracking-tight">
                    Your reservations
                </CardTitle>

                <CardAction className="row-span-1 self-center">
                    <NavLink
                        to="/reservations"
                        className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700"
                    >
                        New booking
                    </NavLink>
                </CardAction>
            </CardHeader>

            <CardContent>
                {reservations.length === 0 ? (
                    <p className="py-8 text-center text-stone-600">
                        You don't have any reservations yet.
                    </p>
                ) : (
                    <ul className="divide-y divide-stone-200">
                        {reservations.map(reservation => {
                            const date = new Date(`${reservation.date}T${reservation.time}`)
                            const weekday = date.toLocaleDateString('en-US', {weekday: 'long'})
                            const meal = date.getHours() < 16 ? 'lunch' : 'dinner'

                            const typeLabel =
                                reservation.type === 'table'
                                    ? 'Table reservation'
                                    : eventLabels[reservation.eventType ?? 'other']

                            return (
                                <li
                                    key={reservation.id}
                                    className="grid grid-cols-[50px_1fr] items-center gap-4 py-5 sm:grid-cols-[65px_1fr_auto] sm:gap-4.5"
                                >
                                    <div className="rounded-lg bg-stone-100 p-2 text-center">
                                        <span className="text-[10px] font-semibold uppercase text-stone-500">
                                            {date.toLocaleDateString('en-US', {month: 'short'})}
                                        </span>

                                        <strong className="block text-2xl leading-tight text-stone-900">
                                            {date.toLocaleDateString('en-US', {day: '2-digit'})}
                                        </strong>
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold tracking-tight text-stone-900">
                                            {weekday} {meal}
                                        </h3>

                                        <p className="mt-1 text-sm text-stone-600">
                                            {reservation.time} · {reservation.guests} guests · {typeLabel}
                                        </p>
                                    </div>

                                    <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-auto">
                                        {reservation.status === 'finished' ? (
                                            <Badge
                                                variant="secondary"
                                                className="bg-emerald-50 text-emerald-700"
                                            >
                                                Finished
                                            </Badge>
                                        ) : (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={onEdit}
                                                    className="border-stone-200 bg-white text-stone-900 hover:bg-stone-100"
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onCancel(reservation)}
                                                    className="text-stone-600"
                                                >
                                                    Cancel reservation
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
