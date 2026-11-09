import ReservationForm from "@/components/reservations/ReservationForm";
import ReservationInfo from "@/components/reservations/ReservationInfo";
import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

export default function ReservationsPage() {
  const { currentUser } = useAuth();
  const { setReservations } = useData();

  return (
    <div className="w-full py-12">
      <div className="mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.125em] text-emerald-700">
          There's a place for you here
        </p>

        <h1 className="font-heading text-4xl font-bold tracking-tight text-stone-900">
          Save your seat.
        </h1>

        <p className="mt-4 text-stone-600">
          Dinner for two or a bigger celebration. Let's make it a good one.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
        <ReservationForm
          currentUser={currentUser}
          setReservations={setReservations}
        />
        <ReservationInfo />
      </div>
    </div>
  );
}
