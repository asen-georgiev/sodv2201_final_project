import {Mail, Phone, UserRound} from 'lucide-react'
import type {User} from '@/types/user'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface AccountDetailsProps {
    user: User
}

export default function AccountDetails({user}: AccountDetailsProps) {
    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight">
                    My details
                </CardTitle>
            </CardHeader>

            <CardContent>
                <ul className="space-y-4 py-4 text-sm text-stone-700">
                    <li className="flex items-center gap-3">
                        <UserRound className="size-4 text-emerald-700"/>
                        {user.name}
                    </li>

                    <li className="flex items-center gap-3">
                        <Mail className="size-4 text-emerald-700"/>
                        {user.email}
                    </li>

                    <li className="flex items-center gap-3">
                        <Phone className="size-4 text-emerald-700"/>
                        {user.phone || 'No phone number'}
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
}
