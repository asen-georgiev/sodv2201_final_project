import { useState } from 'react'
import type { SubmitEvent, Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { User } from '@/types/user'
import type { Reservation, EventType } from '@/types/reservation'
import ReservationConfirmationDialog from './ReservationConfirmationDialog'

type ReservationFormData = Pick<
    Reservation,
    | 'type'
    | 'date'
    | 'time'
    | 'guests'
    | 'phone'
    | 'notes'
    | 'eventType'
    | 'menuPreference'
>

interface ReservationFormProps {
  currentUser: User | null
  setReservations: Dispatch<SetStateAction<Reservation[]>>
}

const timeOptions = [
  { value: '17:00', disabled: false },
  { value: '17:30', disabled: false },
  { value: '18:00', disabled: false },
  { value: '18:30', disabled: false },
  { value: '19:00', disabled: true },
  { value: '19:30', disabled: false },
  { value: '20:00', disabled: false },
]

const eventOptions: { value: EventType; label: string }[] = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'corporate', label: 'Corporate gathering' },
  { value: 'other', label: 'Other celebration' },
]

const menuOptions = [
  'Regular restaurant menu',
  'Vegetarian selection',
  'Discuss a group menu',
]

export default function ReservationForm({
                                          currentUser,
                                          setReservations,
                                        }: ReservationFormProps) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<ReservationFormData>({
    type: 'table',
    date: '',
    time: '',
    guests: 2,
    phone: currentUser?.phone ?? '',
    notes: '',
    eventType: null,
    menuPreference: '',
  })

  const [message, setMessage] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const today = new Date()
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (!currentUser || currentUser.role !== 'customer') {
      setMessage('Sign in with a customer account to make a reservation.')
      return
    }

    const selectedTime = timeOptions.find(
        option => option.value === formData.time,
    )

    if (
        !formData.date ||
        !selectedTime ||
        selectedTime.disabled
    ) {
      setMessage('Choose a valid date and available time.')
      return
    }

    const bookingDate = new Date(`${formData.date}T${formData.time}`)

    if (
        Number.isNaN(bookingDate.getTime()) ||
        bookingDate <= new Date()
    ) {
      setMessage('Choose a future reservation date and time.')
      return
    }

    if (
        !Number.isInteger(formData.guests) ||
        formData.guests < 1 ||
        formData.guests > 40
    ) {
      setMessage('Enter a guest count between 1 and 40.')
      return
    }

    if (!formData.phone.trim()) {
      setMessage('Enter a contact phone number.')
      return
    }

    if (
        formData.type === 'event' &&
        (!formData.eventType ||
            !menuOptions.includes(formData.menuPreference))
    ) {
      setMessage('Please complete the special event fields.')
      return
    }

    const newReservation: Reservation = {
      ...formData,
      id: crypto.randomUUID(),
      userId: currentUser.id,
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
      eventType: formData.type === 'table' ? null : formData.eventType,
      menuPreference:
          formData.type === 'table' ? '' : formData.menuPreference,
      status: 'pending',
    }

    setReservations(previous => [...previous, newReservation])
    setShowConfirmation(true)

    setFormData({
      type: 'table',
      date: '',
      time: '',
      guests: 2,
      phone: currentUser.phone,
      notes: '',
      eventType: null,
      menuPreference: '',
    })
  }

  if (!currentUser) {
    return (
        <Card className="rounded-xl border-stone-200 bg-white shadow-none">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-semibold text-stone-900">
              Save your seat.
            </h2>

            <p className="text-stone-600">
              Sign in to book a table or special event.
            </p>

            <Button
                type="button"
                onClick={() => navigate('/login')}
                className="h-auto bg-orange-600 px-5 py-3 text-white hover:bg-orange-700"
            >
              Sign in
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
    )
  }

  if (currentUser.role !== 'customer') {
    return (
        <Card className="rounded-xl border-stone-200 bg-white shadow-none">
          <CardContent>
            <p className="text-stone-600">
              Reservations are available to customer accounts only.
            </p>
          </CardContent>
        </Card>
    )
  }

  return (
      <>
        <Card className="min-w-0 w-full rounded-xl border-stone-200 bg-white shadow-none">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-semibold text-stone-900">
                Make a reservation
              </h2>

              <Tabs
                  value={formData.type}
                  onValueChange={value => {
                    if (value === 'table' || value === 'event') {
                      setFormData(previous => ({
                        ...previous,
                        type: value,
                      }))
                      setMessage('')
                    }
                  }}
              >
                <TabsList className="grid h-12! w-full grid-cols-2 p-1">
                  <TabsTrigger value="table" className="h-full py-0">
                    <CalendarDays className="size-4 text-emerald-700" />
                    Table reservation
                  </TabsTrigger>

                  <TabsTrigger value="event" className="h-full py-0">
                    Special event
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reservation-name">Full name</Label>
                  <Input
                      id="reservation-name"
                      value={currentUser.name}
                      readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reservation-email">Email address</Label>
                  <Input
                      id="reservation-email"
                      type="email"
                      value={currentUser.email}
                      readOnly
                  />
                </div>

                <div className="min-w-0 space-y-2">
                  <Label htmlFor="reservation-date">Date</Label>
                  <Input
                      id="reservation-date"
                      type="date"
                      min={minimumDate}
                      value={formData.date}
                      onChange={event =>
                          setFormData(previous => ({
                            ...previous,
                            date: event.target.value,
                          }))
                      }
                      required
                  />
                </div>

                <div className="min-w-0 space-y-2">
                  <Label htmlFor="reservation-time">Time</Label>

                  <Select
                      value={formData.time}
                      onValueChange={value => {
                        if (value !== null) {
                          setFormData(previous => ({
                            ...previous,
                            time: value,
                          }))
                        }
                      }}
                      required
                  >
                    <SelectTrigger
                        id="reservation-time"
                        className="h-9! w-full"
                    >
                      <SelectValue placeholder="Choose time">
                        {formData.time || 'Choose time'}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {timeOptions.map(option => (
                          <SelectItem
                              key={option.value}
                              value={option.value}
                              disabled={option.disabled}
                          >
                            {option.value}
                            {option.disabled ? ' — Unavailable' : ''}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reservation-guests">
                    Number of guests
                  </Label>
                  <Input
                      id="reservation-guests"
                      type="number"
                      min={1}
                      max={40}
                      step={1}
                      value={formData.guests}
                      onChange={event =>
                          setFormData(previous => ({
                            ...previous,
                            guests: Number(event.target.value),
                          }))
                      }
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reservation-phone">Phone number</Label>
                  <Input
                      id="reservation-phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={event =>
                          setFormData(previous => ({
                            ...previous,
                            phone: event.target.value,
                          }))
                      }
                      required
                  />
                </div>
              </div>

              {formData.type === 'event' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="reservation-event">Event type</Label>

                      <Select
                          value={formData.eventType ?? ''}
                          onValueChange={value => {
                            const selected = eventOptions.find(
                                option => option.value === value,
                            )

                            if (selected) {
                              setFormData(previous => ({
                                ...previous,
                                eventType: selected.value,
                              }))
                            }
                          }}
                          required
                      >
                        <SelectTrigger
                            id="reservation-event"
                            className="h-9! w-full"
                        >
                          <SelectValue placeholder="Select event type">
                            {eventOptions.find(
                                option => option.value === formData.eventType,
                            )?.label ?? 'Select event type'}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {eventOptions.map(option => (
                              <SelectItem
                                  key={option.value}
                                  value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-0 space-y-2">
                      <Label htmlFor="reservation-menu">Menu preference</Label>

                      <Select
                          value={formData.menuPreference}
                          onValueChange={value => {
                            if (value !== null) {
                              setFormData(previous => ({
                                ...previous,
                                menuPreference: value,
                              }))
                            }
                          }}
                          required
                      >
                        <SelectTrigger
                            id="reservation-menu"
                            className="h-9! w-full"
                        >
                          <SelectValue placeholder="Select menu preference">
                            {formData.menuPreference || 'Select menu preference'}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {menuOptions.map(option => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reservation-notes">
                  Special requests (optional)
                </Label>
                <Textarea
                    id="reservation-notes"
                    value={formData.notes}
                    onChange={event =>
                        setFormData(previous => ({
                          ...previous,
                          notes: event.target.value,
                        }))
                    }
                    rows={3}
                    placeholder="Dietary needs, accessibility, or a special occasion..."
                    className="min-h-24"
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
                <CalendarDays className="mt-0.5 size-4 shrink-0" />
                <span>
                Unavailable times cannot be selected. Your confirmation
                will appear after you submit.
              </span>
              </div>

              {message && (
                  <p role="alert" className="text-sm text-red-700">
                    {message}
                  </p>
              )}

              <Button
                  type="submit"
                  className="h-auto bg-orange-600 px-5 py-3 text-white hover:bg-orange-700"
              >
                Request reservation
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {showConfirmation && (
            <ReservationConfirmationDialog
                onClose={() => setShowConfirmation(false)}
            />
        )}
      </>
  )
}
