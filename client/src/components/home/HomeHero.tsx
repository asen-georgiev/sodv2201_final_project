import {NavLink} from 'react-router-dom'
import {ArrowRight, Clock} from 'lucide-react'
import type {MenuItem} from '@/types/menu'

interface HomeHeroProps {
    dish?: MenuItem
}

export default function HomeHero({dish}: HomeHeroProps) {
    return (
        <section className="-mx-6 bg-emerald-950 text-white">
            <div className="grid items-center gap-10 px-6 py-10 md:grid-cols-2 md:py-16">
                <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-emerald-300">
                        Fresh ingredients. Familiar faces.
                    </p>

                    <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        A little thyme.
                        <br/>
                        A lot of <span className="text-orange-300">flavor.</span>
                    </h1>

                    <p className="mb-7 mt-6 max-w-md text-emerald-100/75">
                        Seasonal dishes, comforting favorites, and a seat at our table.
                        Your next good meal starts here.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <NavLink
                            to="/menu"
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
                        >
                            Explore the menu
                            <ArrowRight className="size-5"/>
                        </NavLink>

                        <NavLink
                            to="/reservations"
                            className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-100"
                        >
                            Book a table
                        </NavLink>
                    </div>

                    <p className="mt-8 flex items-center gap-3 text-xs text-emerald-100/75">
                        <Clock className="size-5"/>
                        Made fresh · Ready for pickup in about 25 minutes
                    </p>
                </div>

                {dish && (
                    <div className="relative mx-auto grid min-h-64 w-full max-w-md place-items-center rounded-full bg-white/5 md:min-h-96 md:max-w-none">
                        <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-full max-w-72 md:max-w-sm"
                        />

                        <div className="absolute bottom-4 left-0 rounded-xl bg-white px-4 py-3 text-stone-900 shadow-lg">
                            <p className="text-xs uppercase text-stone-600">
                                Fresh from our kitchen
                            </p>

                            <p className="text-sm font-bold">
                                {dish.name}{' '}
                                <span className="text-emerald-700">
                                    ${dish.price.toFixed(2)}
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
