
import ReservationForm from '@/components/reservations/ReservationForm'
import ReservationInfo from '@/components/reservations/ReservationInfo'

export default function ReservationsPage() {
    return (
        <main className="bg-stone-50 min-h-screen">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-12">

                {/* Page heading */}
                <div className="mb-10">
                    <p className="text-sm font-medium text-emerald-700">
                        There's a place for you here
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-stone-900">
                        Save your seat.
                    </h1>

                    <p className="mt-4 text-stone-600">
                        Dinner for two or a bigger celebration.
                        Let's make it a good one.
                    </p>
                </div>

                {/* Reservation form and restaurant information */}
     <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
    <ReservationForm />
    <ReservationInfo />
</div>

            </div>
        </main>
    )
}
