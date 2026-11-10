import { useState } from "react";
import type { SubmitEvent, Dispatch, SetStateAction } from "react";
import { CalendarDays, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { User } from "@/types/user";
import type {
  Reservation,
  ReservationType,
  EventType,
} from "@/types/reservation";
import ReservationConfirmationDialog from "./ReservationConfirmationDialog";

type ReservationFormData = Pick<
  Reservation,
  | "type"
  | "date"
  | "time"
  | "guests"
  | "phone"
  | "notes"
  | "eventType"
  | "menuPreference"
>;

interface ReservationFormProps {
  currentUser: User | null;
  setReservations: Dispatch<SetStateAction<Reservation[]>>;
}

export default function ReservationForm({
  currentUser,
  setReservations,
}: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    type: "table",
    date: "",
    time: "",
    guests: 2,
    phone: currentUser?.phone ?? "",
    notes: "",
    eventType: null,
    menuPreference: "",
  });

  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!currentUser) {
      setMessage("Please sign in to make a reservation.");
      return;
    }

    if (
      formData.type === "event" &&
      (!formData.eventType || !formData.menuPreference)
    ) {
      setMessage("Please complete the special event fields.");
      return;
    }

    const newReservation: Reservation = {
      ...formData,
      id: crypto.randomUUID(),
      userId: currentUser.id,
      eventType: formData.type === "table" ? null : formData.eventType,
      menuPreference: formData.type === "table" ? "" : formData.menuPreference,
      status: "pending",
    };

    setReservations((previous) => [...previous, newReservation]);
    setShowConfirmation(true);

    setFormData({
      type: "table",
      date: "",
      time: "",
      guests: 2,
      phone: currentUser.phone ?? "",
      notes: "",
      eventType: null,
      menuPreference: "",
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="min-w-0 w-full rounded-xl border border-stone-200 bg-white p-6"
      >
        <h2 className="mb-6 text-2xl font-semibold text-stone-900">
          Make a reservation
        </h2>

        <Tabs
          value={formData.type}
          onValueChange={(value) =>
            setFormData((previous) => ({
              ...previous,
              type: value as ReservationType,
            }))
          }
          className="mb-6"
        >
          <TabsList className="mb-6 grid h-12! w-full grid-cols-2 p-2">
            <TabsTrigger value="table" className="h-full py-0">
              <CalendarDays className="mr-2 h-4 w-4 text-emerald-700" />
              Table reservation
            </TabsTrigger>

            <TabsTrigger value="event" className="h-full py-0">
              Special event
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reservation-name">Full name</Label>
              <Input
                id="reservation-name"
                value={currentUser?.name ?? ""}
                placeholder="Your name"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation-email">Email address</Label>
              <Input
                id="reservation-email"
                type="email"
                value={currentUser?.email ?? ""}
                placeholder="you@example.com"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <Label htmlFor="reservation-date">Date</Label>
              <Input
                id="reservation-date"
                type="date"
                value={formData.date}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    date: event.target.value,
                  }))
                }
                required
                min={new Date().toLocaleDateString("en-CA")}
              />
            </div>

            <div className="min-w-0 space-y-2">
              <Label htmlFor="reservation-time">Time</Label>
              <select
                id="reservation-time"
                value={formData.time}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    time: event.target.value,
                  }))
                }
                required
                className="h-9 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
              >
                <option value="">Choose time</option>
                <option value="17:00">17:00</option>
                <option value="17:30">17:30</option>
                <option value="18:00">18:00</option>
                <option value="18:30">18:30</option>
                <option value="19:00" disabled>
                  19:00 — Unavailable
                </option>
                <option value="19:30">19:30</option>
                <option value="20:00">20:00</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reservation-guests">Number of guests</Label>
              <Input
                id="reservation-guests"
                type="number"
                min={1}
                max={40}
                value={formData.guests}
                onChange={(event) =>
                  setFormData((previous) => ({
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
                value={formData.phone}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    phone: event.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          {formData.type === "event" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reservation-event">Event type</Label>
                <select
                  id="reservation-event"
                  value={formData.eventType ?? ""}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      eventType: (event.target.value as EventType) || null,
                    }))
                  }
                  required
                  className="h-9 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
                >
                  <option value="">Select event type</option>
                  <option value="birthday">Birthday</option>
                  <option value="corporate">Corporate gathering</option>
                  <option value="other">Other celebration</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reservation-menu">Menu preference</Label>
                <select
                  id="reservation-menu"
                  value={formData.menuPreference}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      menuPreference: event.target.value,
                    }))
                  }
                  required
                  className="h-9 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
                >
                  <option value="">Select menu preference</option>
                  <option value="regular">Regular restaurant menu</option>
                  <option value="vegetarian">Vegetarian selection</option>
                  <option value="group">Discuss a group menu</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="reservation-notes">
              Special requests (optional)
            </Label>
            <textarea
              id="reservation-notes"
              value={formData.notes}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  notes: event.target.value,
                }))
              }
              rows={3}
              placeholder="Dietary needs, accessibility, or a special occasion..."
              className="w-full rounded-lg border border-stone-300 p-3 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>
              Unavailable times cannot be selected. Your confirmation will
              appear after you submit.
            </span>
          </div>

          {message && (
            <p role="status" className="text-sm text-emerald-700">
              {message}
            </p>
          )}

          <Button
            type="submit"
            className="h-auto bg-orange-600 px-5 py-3 text-white hover:bg-orange-700"
          >
            Request reservation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>

      {showConfirmation && (
        <ReservationConfirmationDialog
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}
