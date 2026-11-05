import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
    title: string
    description: string
    action?: ReactNode
}

export default function AdminPageHeader({title, description, action,}: AdminPageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-emerald-700">
                    Management
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                    {title}
                </h1>
                <p className="mt-3 text-stone-600">
                    {description}
                </p>
            </div>
            {action}
        </div>
    )
}
