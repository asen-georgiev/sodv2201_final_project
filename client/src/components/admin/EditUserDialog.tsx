import { useState } from 'react'
import type { SubmitEvent } from 'react'
import type { User } from '@/types/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface EditUserDialogProps {
    user: User
    onClose: () => void
    onSave: (id: string, name: string, email: string) => string | null
}

export default function EditUserDialog({
                                           user,
                                           onClose,
                                           onSave,
                                       }: EditUserDialogProps) {
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [error, setError] = useState('')

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        const trimmedName = name.trim()
        const normalizedEmail = email.trim().toLowerCase()

        if (!trimmedName || !normalizedEmail) {
            setError('Enter a name and email address.')
            return
        }

        const saveError = onSave(user.id, trimmedName, normalizedEmail)

        if (saveError) {
            setError(saveError)
        }
    }

    return (
        <Dialog
            open
            onOpenChange={open => {
                if (!open) onClose()
            }}
        >
            <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-7 sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        Edit customer
                    </DialogTitle>

                    <DialogDescription className="sr-only">
                        Update the customer’s name and email address.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-2 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="edit-user-name">Name</Label>

                        <Input
                            id="edit-user-name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            className="h-12"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-user-email">Email</Label>

                        <Input
                            id="edit-user-email"
                            type="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            className="h-12"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <p className="text-xs text-stone-500">
                        Public registration creates customers only. Admin roles are
                        not editable here.
                    </p>

                    {error && (
                        <p role="alert" className="text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-auto px-4 py-3"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="h-auto bg-orange-600 px-4 py-3 text-white hover:bg-orange-700"
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
