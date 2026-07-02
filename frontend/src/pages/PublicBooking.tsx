import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { apiMessage, isStatus } from "../api/client";
import { publicApi } from "../api/endpoints";
import { StatusMessage } from "../components/StatusMessage";
import { useBookingStore } from "../store/bookingStore";
import type { PublicLink, PublicSlot } from "../types";
import { timeLabel } from "../utils/time";
import { NotFound } from "./NotFound";

export const PublicBooking = () => {
  const { token = "" } = useParams();
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedSlot = useBookingStore((state) => state.selectedSlot);
  const setDate = useBookingStore((state) => state.setDate);
  const setSlot = useBookingStore((state) => state.setSlot);
  const [link, setLink] = useState<PublicLink | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<PublicSlot[]>([]);
  const [visitor, setVisitor] = useState({ visitor_name: "", visitor_email: "" });
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [nextLink, nextDates] = await Promise.all([publicApi.link(token), publicApi.dates(token)]);
        if (!alive) return;
        setLink(nextLink);
        setDates(nextDates);
        if (nextDates[0]) setDate(nextDates[0]);
      } catch (err) {
        if (isStatus(err, 404)) setNotFound(true);
        else setError(apiMessage(err, "Unable to load booking link"));
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [setDate, token]);

  const refreshSlots = async (date: string) => {
    if (!date) return;
    setSlotsLoading(true);
    setError("");
    try {
      setSlots(await publicApi.slots(token, date));
    } catch (err) {
      setError(apiMessage(err, "Unable to load slots"));
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    refreshSlots(selectedDate);
  }, [selectedDate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!selectedSlot) return;
    try {
      await publicApi.book(token, {
        date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        ...visitor
      });
      setMessage("Your booking is confirmed.");
      setSlot(null);
      setVisitor({ visitor_name: "", visitor_email: "" });
      await refreshSlots(selectedDate);
    } catch (err) {
      setError(apiMessage(err, "Unable to create booking"));
      if (isStatus(err, 409)) await refreshSlots(selectedDate);
    }
  };

  if (notFound) return <NotFound />;

  return (
    <main className="min-h-screen bg-skyglass px-4 py-8 text-ink">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays className="h-8 w-8 text-moss" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-semibold">Book a Time</h1>
            <p className="text-sm text-slate-600">{link?.host.name ? `With ${link.host.name}` : "Loading host..."}</p>
          </div>
        </div>

        {loading ? <StatusMessage>Loading booking page...</StatusMessage> : null}
        {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
        {message ? <StatusMessage tone="success">{message}</StatusMessage> : null}

        {!loading ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-[260px_1fr]">
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold">Available Dates</h2>
              <div className="mt-3 space-y-2">
                {dates.length === 0 ? (
                  <p className="text-sm text-slate-500">No future dates are available.</p>
                ) : (
                  dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setDate(date)}
                      className={`w-full rounded-md border px-3 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-moss/30 ${selectedDate === date ? "border-moss bg-moss text-white" : "border-slate-200 hover:bg-slate-50"}`}
                    >
                      {date}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div>
                <h2 className="font-semibold">Time Slots</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {slotsLoading ? <p className="col-span-full text-sm text-slate-500">Loading slots...</p> : null}
                  {!slotsLoading && slots.length === 0 ? <p className="col-span-full text-sm text-slate-500">No slots available for this date.</p> : null}
                  {slots.map((slot) => {
                    const active = selectedSlot?.start_time === slot.start_time;
                    return (
                      <button
                        key={`${slot.start_time}-${slot.end_time}`}
                        onClick={() => setSlot(slot)}
                        aria-pressed={active}
                        className={`rounded-md border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-moss/30 ${active ? "border-moss bg-moss text-white" : "border-slate-200 hover:bg-slate-50"}`}
                      >
                        {timeLabel(slot.start_time)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedSlot ? (
                <form onSubmit={submit} className="space-y-3 border-t border-slate-200 pt-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-moss">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {selectedDate} · {timeLabel(selectedSlot.start_time)}-{timeLabel(selectedSlot.end_time)}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium" htmlFor="visitor_name">Name</label>
                      <input id="visitor_name" value={visitor.visitor_name} onChange={(event) => setVisitor((current) => ({ ...current, visitor_name: event.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20" required />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium" htmlFor="visitor_email">Email</label>
                      <input id="visitor_email" type="email" value={visitor.visitor_email} onChange={(event) => setVisitor((current) => ({ ...current, visitor_email: event.target.value }))} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-moss focus:outline-none focus:ring-2 focus:ring-moss/20" required />
                    </div>
                  </div>
                  <button className="rounded-md bg-coral px-4 py-2 font-medium text-white hover:bg-coral/90">Book</button>
                </form>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
};
