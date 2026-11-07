
import { MapPin } from 'lucide-react'
import ReservationImage from './ReservationImage'

export default function ReservationInfo() {
    return (
        <aside className="overflow-hidden rounded-xl bg-emerald-900 text-white">

            <ReservationImage />

            <div className="p-6">

                {/* Heading */}
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-emerald-200">
                    Come hungry. Stay a while.
                </p>

               <h2 className="mb-3 text-2xl font-bold leading-tight">
    Good food tastes
    <br />
    better together.
</h2>

                <p className="mb-6 text-sm text-emerald-100">
                    A cozy table, a seasonal menu, and time well spent.
                </p>

                {/* Address */}
                <div className="mb-6 flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>123 Thyme Street · Sample location</span>
                </div>

                {/* Opening hours */}
                <div className="border-t border-emerald-700 pt-4 text-sm">

                    <div className="flex justify-between border-b border-emerald-700 py-3">
                        <span>Monday – Thursday</span>
                        <span>11:00 – 21:00</span>
                    </div>

                    <div className="flex justify-between border-b border-emerald-700 py-3">
                        <span>Friday – Saturday</span>
                        <span>11:00 – 22:00</span>
                    </div>

                    <div className="flex justify-between border-b border-emerald-700 py-3">
                        <span>Sunday</span>
                        <span>12:00 – 20:00</span>
                    </div>

                    <p className="mt-4 text-xs text-emerald-200">
                        Illustrative restaurant hours for the design.
                    </p>
                </div>
            </div>
        </aside>
    )
}
