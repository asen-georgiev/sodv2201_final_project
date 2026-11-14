import {useState} from 'react'
import type {SubmitEvent} from 'react'
import type {User} from '@/types/user'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export interface AccountDetailsInput {
    name: string
    email: string
    phone: string
}

interface AccountDetailsFormProps {
    user: User
    onSave: (input: AccountDetailsInput) => string
}

export default function AccountDetailsForm({user, onSave}: AccountDetailsFormProps) {
    const [formData, setFormData] = useState<AccountDetailsInput>({
        name: user.name,
        email: user.email,
        phone: user.phone,
    })
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaved(false)

        const saveError = onSave(formData)

        if (saveError) {
            setError(saveError)
            return
        }

        setError('')
        setSaved(true)
    }

    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight">
                    Account details
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="pt-4">
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="account-name">Full name</Label>

                            <Input
                                id="account-name"
                                name="name"
                                autoComplete="name"
                                value={formData.name}
                                onChange={event =>
                                    setFormData(previous => ({
                                        ...previous,
                                        name: event.target.value,
                                    }))
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="account-phone">Phone</Label>

                            <Input
                                id="account-phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                value={formData.phone}
                                onChange={event =>
                                    setFormData(previous => ({
                                        ...previous,
                                        phone: event.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="account-email">Email</Label>

                            <Input
                                id="account-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={event =>
                                    setFormData(previous => ({
                                        ...previous,
                                        email: event.target.value,
                                    }))
                                }
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="mt-4 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    {saved && (
                        <p role="status" className="mt-4 text-sm text-emerald-700">
                            Your details have been saved.
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="mt-6 h-auto bg-orange-600 px-4 py-3 text-white hover:bg-orange-700"
                    >
                        Save changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
