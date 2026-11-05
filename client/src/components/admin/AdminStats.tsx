import {Card, CardContent,} from '@/components/ui/card'
import type {AdminStatsProps} from "@/types/menu.ts";
export default function AdminStats({ items }: AdminStatsProps) {
    return (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {items.map(item => (
                <Card
                    key={item.label}
                    className="gap-0 rounded-xl border-stone-200 bg-white py-0 shadow-none"
                >
                    <CardContent className="px-5 py-5">
                        <p className="text-sm text-stone-600">
                            {item.label}
                        </p>

                        <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                            {item.value}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
