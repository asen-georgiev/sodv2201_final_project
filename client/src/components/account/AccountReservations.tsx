import type {Reservation} from '@/types/reservation'
import {Badge} from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface AccountReservationsProps {
    reservations: Reservation[]
}

export default function AccountReservations({reservations}: AccountReservationsProps) {
    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight">
                    My reservations
                </CardTitle>
            </CardHeader>

            <CardContent>
                {reservations.length === 0 ? (
                    <p className="py-8 text-center text-stone-600">
                        You don't have any reservations yet.
                    </p>
                ) : (
                    <ul className="divide-y divide-stone-200">
                        {reservations.map(reservation => {
                            const isFinished = reservation.status === 'finished'

                            return (
                                <li
                                    key={reservation.id}
                                    className="flex flex-wrap items-start justify-between gap-4 py-5"
                                >
                                    <div>
                                        <p className="font-semibold text-stone-900">
                                            {new Date(
                                                `${reservation.date}T${reservation.time}`,
                                            ).toLocaleDateString()} at {reservation.time}
                                        </p>

                                        <p className="mt-1 text-sm text-stone-600">
                                            {reservation.type === 'table'
                                                ? 'Table reservation'
                                                : `Event (${reservation.eventType ?? 'other'})`}
                                            {' · '}
                                            {reservation.guests} guests
                                        </p>

                                        {reservation.notes && (
                                            <p className="mt-1 text-xs text-stone-500">
                                                {reservation.notes}
                                            </p>
                                        )}
                                    </div>

                                    <Badge
                                        variant="secondary"
                                        className={
                                            isFinished
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-orange-50 text-orange-700'
                                        }
                                    >
                                        {isFinished ? 'Finished' : 'Pending'}
                                    </Badge>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
