import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LoginInput } from '@/types/user'
import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

export default function LoginForm() {
    const [formData, setFormData] = useState<LoginInput>({
        email: '',
        password: '',
    })
    const { login } = useAuth()
    const navigate = useNavigate()
    const [error, setError] = useState('')

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        const user = login(formData)
        if (!user) {
            setError('Invalid email or password.')
            return
        }
        navigate(user.role === 'admin' ? '/admin/menu' : '/account', {
            replace: true,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-emerald-700">
                    Welcome back
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                    Take your usual seat.
                </h2>

                <p className="mt-3 text-sm text-stone-600">
                    Sign in to manage your orders and reservations.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="login-email">Email address</Label>

                <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
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
                <Label htmlFor="login-password">Password</Label>

                <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={event =>
                        setFormData(previous => ({
                            ...previous,
                            password: event.target.value,
                        }))
                    }
                    required
                />
            </div>
            {error && (
                <p role="alert" className="text-sm text-red-700">
                    {error}
                </p>
            )}
            <Button type="submit" className="w-full bg-orange-600 text-white hover:bg-orange-700 h-auto py-2">
                Sign in
            </Button>
        </form>
    )
}
