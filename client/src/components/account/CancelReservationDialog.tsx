import {X} from 'lucide-react'
import type {Reservation} from '@/types/reservation'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'

interface CancelReservationDialogProps {
    reservation: Reservation
    onConfirm: (id: string) => void
    onClose: () => void
}

export default function CancelReservationDialog({reservation, onConfirm, onClose}: CancelReservationDialogProps) {
    const date = new Date(`${reservation.date}T${reservation.time}`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })

    return (
        <Dialog
            open
            onOpenChange={open => {
                if (!open) onClose()
            }}
        >
            <DialogContent showCloseButton={false} className="rounded-2xl p-7 sm:max-w-md">
                <div className="flex items-center justify-between gap-3">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        Cancel reservation?
                    </DialogTitle>

                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Close dialog"
                                className="text-stone-600"
                            />
                        }
                    >
                        <X className="size-4"/>
                    </DialogClose>
                </div>

                <DialogDescription className="mt-3 text-stone-600">
                    {date} at {reservation.time} · {reservation.guests} guests.
                    This booking will be removed from your reservations.
                </DialogDescription>

                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="h-auto px-4 py-3"
                    >
                        Keep booking
                    </Button>

                    <Button
                        type="button"
                        onClick={() => onConfirm(reservation.id)}
                        className="h-auto bg-red-50 px-4 py-3 text-red-700 hover:bg-red-100"
                    >
                        Cancel reservation
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
