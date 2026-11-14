import {NavLink} from 'react-router-dom'
import {X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'

interface EditReservationDialogProps {
    onClose: () => void
}

export default function EditReservationDialog({onClose}: EditReservationDialogProps) {
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
                        Edit reservation
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
                    Adjust a reservation using the same fields as the booking form.
                </DialogDescription>

                <div className="mt-4 flex justify-end">
                    <NavLink
                        to="/reservations"
                        className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                    >
                        Open booking form
                    </NavLink>
                </div>
            </DialogContent>
        </Dialog>
    )
}
