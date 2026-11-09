interface UserPageHeaderProps {
    eyebrow: string
    title: string
    description: string
}

export default function UserPageHeader({eyebrow, title, description,}: UserPageHeaderProps) {
    return (
        <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-emerald-700">
                {eyebrow}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                {title}
            </h1>

            <p className="mt-3 text-stone-600">
                {description}
            </p>
        </div>
    )
}
