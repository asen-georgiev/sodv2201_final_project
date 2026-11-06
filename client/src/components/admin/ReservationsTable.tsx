import type {
    EventType,
    Reservation,
    ReservationStatus,
} from '@/types/reservation'
import type { User } from '@/types/user'
import { Badge } from '@/components/ui/badge'
import { Card, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface ReservationsTableProps {
    reservations: Reservation[]
    users: User[]
    totalReservations: number
    onStatusChange: (id: string, status: ReservationStatus) => void
}

const bookingTypes: Record<
    'table' | EventType,
    { label: string; className: string }
> = {
    table: {
        label: 'Table',
        className: 'bg-blue-50 text-blue-700 p-3',
    },
    birthday: {
        label: 'Birthday',
        className: 'bg-purple-50 text-purple-700 p-3',
    },
    corporate: {
        label: 'Corporate',
        className: 'bg-amber-50 text-amber-800 p-3',
    },
    other: {
        label: 'Other event',
        className: 'bg-teal-50 text-teal-700 p-3',
    },
}

export default function ReservationsTable({
                                              reservations,
                                              users,
                                              totalReservations,
                                              onStatusChange,
                                          }: ReservationsTableProps) {
    return (
        <Card className="gap-0 overflow-hidden rounded-xl border-stone-200 bg-white py-0 shadow-none">
            <Table>
                <TableHeader>
                    <TableRow className="bg-stone-50 hover:bg-stone-50">
                        <TableHead className="px-5 py-4">
                            Guest / organizer
                        </TableHead>
                        <TableHead className="px-5 py-4">Date & time</TableHead>
                        <TableHead className="px-5 py-4">Guests</TableHead>
                        <TableHead className="px-5 py-4">Type</TableHead>
                        <TableHead className="px-5 py-4">Requests</TableHead>
                        <TableHead className="px-5 py-4">Finished?</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {reservations.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="px-5 py-12 text-center text-stone-500"
                            >
                                No reservations found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        reservations.map(reservation => {
                            const customer = users.find(
                                user => user.id === reservation.userId,
                            )

                            const isFinished = reservation.status === 'finished'

                            const bookingType =
                                reservation.type === 'table'
                                    ? 'table'
                                    : reservation.eventType ?? 'other'

                            const typeStyle = bookingTypes[bookingType]

                            const requests = [
                                reservation.menuPreference,
                                reservation.notes,
                            ].filter(value => value.trim() !== '')

                            return (
                                <TableRow key={reservation.id}>
                                    <TableCell className="px-5 py-4">
                                        <p className="font-semibold">
                                            {customer?.name ?? 'Deleted customer'}
                                        </p>

                                        <p className="mt-1 text-xs text-stone-500">
                                            {customer?.email ?? 'Account unavailable'}
                                        </p>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <p>
                                            {new Date(
                                                `${reservation.date}T${reservation.time}`,
                                            ).toLocaleDateString()}
                                        </p>

                                        <p className="mt-1 text-xs text-stone-500">
                                            {reservation.time}
                                        </p>
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        {reservation.guests}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <Badge
                                            variant="secondary"
                                            className={typeStyle.className}
                                        >
                                            {typeStyle.label}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="max-w-64 whitespace-normal px-5 py-4 text-sm text-stone-600">
                                        {requests.length > 0
                                            ? requests.join(' · ')
                                            : 'No special requests'}
                                    </TableCell>

                                    <TableCell className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={isFinished}
                                                onCheckedChange={checked =>
                                                    onStatusChange(
                                                        reservation.id,
                                                        checked ? 'finished' : 'pending',
                                                    )
                                                }
                                                aria-label={`Mark reservation ${reservation.id} as finished`}
                                            />

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
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            <CardFooter className="justify-between border-t border-stone-200 px-5 py-4 text-xs text-stone-500">
        <span>
          Showing {reservations.length} of {totalReservations} bookings
        </span>

                <span>Reservation management</span>
            </CardFooter>
        </Card>
    )
}
