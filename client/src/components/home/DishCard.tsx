import {Plus} from 'lucide-react'
import type {MenuItem} from '@/types/menu'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'

interface DishCardProps {
    dish: MenuItem
    onSelect: (dish: MenuItem) => void
}

export default function DishCard({dish, onSelect}: DishCardProps) {
    return (
        <Card className="gap-0 overflow-hidden rounded-xl border-stone-200 bg-white py-0 shadow-none">
            <div className="relative grid h-40 place-items-center bg-stone-100 md:h-48">
                <img
                    src={dish.imageUrl}
                    alt=""
                    className="h-36 w-auto md:h-40"
                />

                <Badge
                    variant="secondary"
                    className="absolute left-4 top-4 rounded-md bg-white p-3 font-semibold capitalize text-emerald-700"
                >
                    {dish.dietaryOptions[0] ?? 'Popular'}
                </Badge>
            </div>

            <CardContent className="p-4 lg:p-5">
                <h3 className="text-lg font-bold tracking-tight text-stone-900">
                    {dish.name}
                </h3>

                <p className="mb-5 mt-2 min-h-10 text-sm text-stone-600">
                    {dish.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tracking-tight">
                        ${dish.price.toFixed(2)}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        onClick={() => onSelect(dish)}
                        aria-label={`View ${dish.name}`}
                        className="text-emerald-700"
                    >
                        <Plus className="size-5"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
