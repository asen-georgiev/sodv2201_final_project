import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RegisterInput } from '@/types/user'
import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

export default function RegisterForm() {
    const [formData, setFormData] = useState<RegisterInput>({
        name: '',
        email: '',
        phone: '',
        password: '',
    })
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const { register } = useAuth()
    const navigate = useNavigate()

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        if (formData.password !== confirmPassword) {
            setError('Passwords must match.')
            return
        }

        const result = register(formData)

        if (result.success === false) {
            setError(result.error)
            return
        }

        navigate('/account', { replace: true })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-emerald-700">
                    A place at our table
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                    Make yourself at home.
                </h2>

                <p className="mt-3 text-sm text-stone-600">
                    Create your customer account.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-name">Full name</Label>

                <Input
                    id="register-name"
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
                <Label htmlFor="register-email">Email address</Label>

                <Input
                    id="register-email"
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

            <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>

                <Input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={formData.password}
                    onChange={event =>
                        setFormData(previous => ({
                            ...previous,
                            password: event.target.value,
                        }))
                    }
                    required
                />

                <p className="text-xs text-stone-500">
                    At least 8 characters.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="register-confirm-password">
                    Confirm password
                </Label>

                <Input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    required
                />
            </div>

            {error && (
                <p role="alert" className="text-sm text-red-700">
                    {error}
                </p>
            )}

            <Button type="submit" className="w-full bg-orange-600 text-white hover:bg-orange-700 h-auto py-2">
                Create customer account
            </Button>

            <p className="text-xs text-stone-500">
                Customer registration only. Administrator accounts are pre-existing.
            </p>
        </form>
    )
}
