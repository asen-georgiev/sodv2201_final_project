import {NavLink} from 'react-router-dom'

export default function ReservationCallout() {
    return (
        <section className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 p-8">
            <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-orange-700">
                    Make room for good company
                </p>

                <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                    A table for two. Or a reason to celebrate.
                </h2>

                <p className="mt-4 text-stone-600">
                    Join us for dinner, a birthday, or your next gathering.
                </p>
            </div>

            <NavLink
                to="/reservations"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-900 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-950"
            >
                Reserve your table
            </NavLink>
        </section>
    )
}
