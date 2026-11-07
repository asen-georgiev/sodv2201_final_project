
import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import type {
    ReservationType,
    EventType
} from '@/types/reservation'
import { CalendarDays, ArrowRight } from 'lucide-react'

export default function ReservationForm() {
    const { currentUser } = useAuth()

    // Reservation type
    const [type, setType] = useState<ReservationType>('table')

    // Form fields
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [guests, setGuests] = useState(2)
    const [phone, setPhone] = useState(currentUser?.phone || '')
    const [notes, setNotes] = useState('')

    // Special event fields
    const [eventType, setEventType] = useState<EventType | ''>('')
    const [menuPreference, setMenuPreference] = useState('')

    function handleReservation(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!currentUser) {
            alert('Please sign in to make a reservation')
            return
        }

        // We will save the reservation in the next step
        console.log({
            type,
            date,
            time,
            guests,
            phone,
            notes,
            eventType: type === 'table' ? null : eventType,
            menuPreference: type === 'table' ? '' : menuPreference
        })

        alert('Form submitted for testing!')
    }

    return (
       <form
    onSubmit={handleReservation}
    className="min-w-0 w-full rounded-xl border border-stone-200 bg-white p-6"
>
            <h2 className="mb-6 text-2xl font-semibold text-stone-900">
                Make a reservation
            </h2>

         
{/* Reservation tabs */}
<div className="mb-6 flex gap-2 rounded-lg bg-stone-100 p-1">
    <Button
        type="button"
        variant="ghost"
        onClick={() => setType('table')}
        className={
            type === 'table'
                ? 'bg-white text-emerald-800 hover:bg-white'
                : 'text-stone-600 hover:bg-stone-200'
        }
    >
        <CalendarDays className="mr-1 h-4 w-4" />
        Table reservation
    </Button>

    <Button
        type="button"
        variant="ghost"
        onClick={() => setType('event')}
        className={
            type === 'event'
                ? 'bg-white text-emerald-800 hover:bg-white'
                : 'text-stone-600 hover:bg-stone-200'
        }
    >
        Special event
    </Button>
</div>


            <div className="space-y-4">
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

    {/* Full name */}
    <div>
        <label className="mb-1 block text-sm font-medium">
            Full name
        </label>
        <input
            type="text"
            value={currentUser?.name || ''}
            readOnly
            placeholder="Your name"
            className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3"
        />
    </div>

    {/* Email */}
    <div>
        <label className="mb-1 block text-sm font-medium">
            Email address
        </label>
        <input
            type="email"
            value={currentUser?.email || ''}
            readOnly
            placeholder="you@example.com"
            className="w-full rounded-lg border border-stone-300 bg-stone-50 p-3"
        />
    </div>

</div>

                {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="w-full rounded-lg border border-stone-300 p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Time
                        </label>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="w-full rounded-lg border border-stone-300 p-3"
                        >
                            <option value="">Choose time</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="18:30">6:30 PM</option>
                            <option value="19:00" disabled>
                                7:00 PM — Unavailable
                            </option>
                            <option value="19:30">7:30 PM</option>
                            <option value="20:00">8:00 PM</option>
                        </select>
                    </div>
                </div>

                {/* Guests and Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Number of guests
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="40"
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            required
                            className="w-full rounded-lg border border-stone-300 p-3"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Phone number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full rounded-lg border border-stone-300 p-3"
                        />
                    </div>
                </div>

                {/* Special Event fields */}
                {type === 'event' && (
                    <>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Event type
                            </label>
                            <select
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value as EventType)}
                                required
                                className="w-full rounded-lg border border-stone-300 p-3"
                            >
                                <option value="">Select event type</option>
                                <option value="birthday">Birthday</option>
                                <option value="corporate">Corporate gathering</option>
                                <option value="other">Other celebration</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Menu preference
                            </label>
                            <select
                                value={menuPreference}
                                onChange={(e) => setMenuPreference(e.target.value)}
                                required
                                className="w-full rounded-lg border border-stone-300 p-3"
                            >
                                <option value="">Select menu preference</option>
                                <option value="regular">Regular restaurant menu</option>
                                <option value="vegetarian">Vegetarian selection</option>
                                <option value="group">Discuss a group menu</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Special Requests */}
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Special requests (optional)
                    </label>
                    <textarea
    value={notes}
    onChange={(e) => setNotes(e.target.value)}
    rows={3}
    placeholder="Dietary needs, accessibility, or a special occasion..."
    className="w-full rounded-lg border border-stone-300 p-3"
/>
                </div>

              
{/* Reservation notice */}
<div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
    <CalendarDays className="h-4 w-4 shrink-0" />

    <span>
        Unavailable times cannot be selected.
        Your confirmation will appear after you submit.
    </span>
</div>


                
<Button
    type="submit"
    className="bg-orange-600 px-5 py-5 text-white hover:bg-orange-700"
>
    Request reservation
    <ArrowRight className="ml-2 h-4 w-4" />
</Button>

            </div>
        </form>
    )
}
