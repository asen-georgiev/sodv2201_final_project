import {NavLink} from 'react-router-dom'
import {ArrowRight} from 'lucide-react'
import type {MenuItem} from '@/types/menu'
import DishCard from '@/components/home/DishCard'

interface FeaturedDishesProps {
    dishes: MenuItem[]
    onSelect: (dish: MenuItem) => void
}

export default function FeaturedDishes({dishes, onSelect}: FeaturedDishesProps) {
    return (
        <section aria-labelledby="featured-dishes-title" className="mt-10 md:mt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-emerald-700">
                        The dishes you come back for
                    </p>

                    <h2
                        id="featured-dishes-title"
                        className="text-3xl font-bold tracking-tight text-stone-900"
                    >
                        Meet your new favorites.
                    </h2>
                </div>

                <NavLink
                    to="/menu"
                    className="inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-stone-600 hover:text-emerald-700"
                >
                    View full menu
                    <ArrowRight className="size-4"/>
                </NavLink>
            </div>

            {dishes.length === 0 ? (
                <p className="py-8 text-center text-stone-600">
                    Our featured dishes are coming back soon.
                </p>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {dishes.map(dish => (
                        <DishCard
                            key={dish.id}
                            dish={dish}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
